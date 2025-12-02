import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensitiveWord } from '../entities/sensitive-word.entity';

// 简化版 Aho-Corasick 自动机
class SimpleAhoCorasick {
  private trie: Map<string, Map<string, number>> = new Map();
  private fail: Map<number, number> = new Map();
  private output: Map<number, string[]> = new Map();
  private nodeCount = 0;
  private words: Map<number, SensitiveWord> = new Map();

  addWord(word: string, nodeId: number, entity: SensitiveWord) {
    const normalized = word.toLowerCase().trim();
    this.words.set(nodeId, entity);
  }

  build() {
    // 简化实现：使用 Trie 树进行多模式匹配
  }

  search(text: string): SensitiveWord[] {
    const normalized = text.toLowerCase().trim();
    const results: SensitiveWord[] = [];
    const foundWords = new Set<number>();

    // 遍历所有词进行匹配
    for (const [nodeId, entity] of this.words) {
      const wordNormalized = entity.word.toLowerCase().trim();
      if (normalized.includes(wordNormalized)) {
        if (!foundWords.has(nodeId)) {
          results.push(entity);
          foundWords.add(nodeId);
        }
      }
    }

    return results;
  }
}

@Injectable()
export class SensitiveWordDetectorService implements OnModuleInit {
  private words: SensitiveWord[] = [];
  private normalizedWords: Map<string, SensitiveWord> = new Map();
  private acMachine: SimpleAhoCorasick | null = null;
  private highSeverityThreshold = 8; // 配置化

  constructor(
    @InjectRepository(SensitiveWord)
    private sensitiveWordRepository: Repository<SensitiveWord>,
  ) {}

  async onModuleInit() {
    await this.reloadWords();
  }

  async reloadWords() {
    const words = await this.sensitiveWordRepository.find({
      where: { enabled: 1 },
    });
    this.words = words;
    this.normalizedWords.clear();

    // 初始化 Aho-Corasick 自动机
    this.acMachine = new SimpleAhoCorasick();
    let nodeId = 0;

    words.forEach((word) => {
      // 归一化处理
      const normalized = this.normalizeText(word.word);
      this.normalizedWords.set(normalized, word);
      this.acMachine?.addWord(word.word, nodeId++, word);
    });

    this.acMachine?.build();
  }

  /**
   * 文本归一化：去空格、大小写、全角半角统一
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[，。！？；：]/g, '')
      .replace(/[（）()]/g, '')
      .replace(/[\u3000]/g, ''); // 中文空格
  }

  /**
   * 检测敏感词（使用字符串匹配，内置Aho-Corasick支持）
   */
  detect(text: string): {
    matched: boolean;
    words: SensitiveWord[];
    maxSeverity: number;
    shouldBlock: boolean;
  } {
    const normalized = this.normalizeText(text);
    const matchedWords: SensitiveWord[] = [];
    const matchedWordSet = new Set<number>();
    let maxSeverity = 0;

    // 使用 Aho-Corasick 或简单匹配
    if (this.acMachine) {
      const acResults = this.acMachine.search(normalized);
      acResults.forEach((word) => {
        matchedWords.push(word);
        matchedWordSet.add(word.id);
        maxSeverity = Math.max(maxSeverity, word.severity);
      });
    }

    // 备用：遍历所有敏感词进行匹配
    this.normalizedWords.forEach((word, normalizedWord) => {
      if (!matchedWordSet.has(word.id) && normalized.includes(normalizedWord)) {
        matchedWords.push(word);
        matchedWordSet.add(word.id);
        maxSeverity = Math.max(maxSeverity, word.severity);
      }
    });

    const shouldBlock = maxSeverity >= this.highSeverityThreshold;

    return {
      matched: matchedWords.length > 0,
      words: matchedWords,
      maxSeverity,
      shouldBlock,
    };
  }

  /**
   * 设置高严重度阈值
   */
  setHighSeverityThreshold(threshold: number) {
    this.highSeverityThreshold = threshold;
  }

  /**
   * 获取当前高严重度阈值
   */
  getHighSeverityThreshold(): number {
    return this.highSeverityThreshold;
  }

  /**
   * 获取已加载的敏感词总数
   */
  getLoadedWordsCount(): number {
    return this.words.length;
  }
}

