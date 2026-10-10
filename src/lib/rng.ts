/**
 * Seedable pseudo-random number generator (Mulberry32)
 * Ensures reproducible Monte Carlo experiments as required by GodDice specification.
 */
export class SeededRNG {
  private state: number;

  constructor(seed: number = Date.now()) {
    this.state = seed >>> 0;
  }

  /**
   * Returns a pseudo-random float in [0, 1)
   */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns a random integer in [min, max] inclusive
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Returns a random boolean with probability p
   */
  nextBool(p: number = 0.5): boolean {
    return this.next() < p;
  }

  /**
   * Standard normal random variable via Box-Muller transform
   */
  nextGaussian(mean: number = 0, stdDev: number = 1): number {
    const u1 = Math.max(1e-15, this.next());
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }

  /**
   * Fisher-Yates array shuffle in place
   */
  shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Pick random item from array
   */
  choice<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
}

export function createRNG(seed?: number): SeededRNG {
  return new SeededRNG(seed);
}
