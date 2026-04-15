import { Injectable } from '@angular/core';

export interface ResponsiveImage {
  src: string;
  srcset: string;
  sources: {
    type: string;
    srcset: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private readonly sizes = [400, 800, 1200];
  private readonly imageFormats = ['webp', 'jpg'];
  private readonly basePath = '/assets';

  getResponsiveImage(imagePath: string): ResponsiveImage {
    const baseUrl = `${this.basePath}/${imagePath}`;
    const fileName = imagePath.split('.').slice(0, -1).join('.');
    const extension = imagePath.split('.').pop() || 'jpg';

    const srcset = this.sizes
      .map(size => `${this.basePath}/${fileName}-${size}.${extension} ${size}w`)
      .join(', ');

    const sources = this.imageFormats.map(format => ({
      type: `image/${format}`,
      srcset: this.sizes
        .map(size => `${this.basePath}/${fileName}-${size}.${format} ${size}w`)
        .join(', ')
    }));

    return {
      src: baseUrl,
      srcset,
      sources
    };
  }

  getSrcset(imagePath: string): string {
    const fileName = imagePath.split('.').slice(0, -1).join('.');
    const extension = imagePath.split('.').pop() || 'jpg';

    return this.sizes
      .map(size => `${this.basePath}/${fileName}-${size}.${extension} ${size}w`)
      .join(', ');
  }

  getPlaceholderUrl(imagePath: string): string {
    const fileName = imagePath.split('.').slice(0, -1).join('.');
    return `${this.basePath}/${fileName}-placeholder.jpg`;
  }
}