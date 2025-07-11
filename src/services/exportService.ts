import html2canvas from 'html2canvas';

export class ExportService {
  /**
   * Export canvas area to image
   * @param canvasElement - DOM element to capture
   * @param filename - Filename for download (without extension)
   * @param format - Export format: 'png', 'jpeg', 'webp'
   * @param quality - Image quality (0-1) for jpeg/webp
   */
  static async exportToImage(
    canvasElement: HTMLElement,
    filename = 'design',
    format: 'png' | 'jpeg' | 'webp' = 'png',
    quality = 0.9
  ): Promise<string> {
    try {
      // Convert oklch colors to rgb before capturing
      await this.convertOklchToRgb(canvasElement);
      
      // Configure html2canvas options
      const options = {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        removeContainer: true,
        logging: false,
        width: canvasElement.offsetWidth,
        height: canvasElement.offsetHeight,
        ignoreElements: (element: Element) => {
          // Ignore elements outside canvas area
          return !canvasElement.contains(element) && element !== canvasElement;
        }
      };

      // Capture canvas
      const canvas = await html2canvas(canvasElement, options);
      
      // Convert to desired format
      let mimeType = 'image/png';
      let extension = 'png';
      
      if (format === 'jpeg') {
        mimeType = 'image/jpeg';
        extension = 'jpg';
      } else if (format === 'webp') {
        mimeType = 'image/webp';
        extension = 'webp';
      }

      // Get data URL
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      // Download the image
      this.downloadImage(dataUrl, `${filename}.${extension}`);
      
      return dataUrl;
    } catch (error) {
      console.error('Error exporting to image:', error);
      throw new Error('Failed to export image');
    }
  }

  /**
   * Convert oklch colors to rgb for html2canvas compatibility
   */
  private static async convertOklchToRgb(element: HTMLElement): Promise<void> {
    const allElements = element.querySelectorAll('*');
    
    allElements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el);
      const htmlEl = el as HTMLElement;
      
      // Convert background color
      if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('oklch')) {
        htmlEl.style.backgroundColor = this.oklchToRgb(computedStyle.backgroundColor);
      }
      
      // Convert color
      if (computedStyle.color && computedStyle.color.includes('oklch')) {
        htmlEl.style.color = this.oklchToRgb(computedStyle.color);
      }
      
      // Convert border color
      if (computedStyle.borderColor && computedStyle.borderColor.includes('oklch')) {
        htmlEl.style.borderColor = this.oklchToRgb(computedStyle.borderColor);
      }
    });
  }

  /**
   * Simple oklch to rgb conversion (fallback)
   */
  private static oklchToRgb(oklchColor: string): string {
    // For now, return common fallback colors
    if (oklchColor.includes('oklch')) {
      // Extract lightness value and convert to grayscale
      const match = oklchColor.match(/oklch\(([0-9.]+)/);
      if (match) {
        const lightness = parseFloat(match[1]);
        const gray = Math.round(lightness * 255);
        return `rgb(${gray}, ${gray}, ${gray})`;
      }
    }
    return oklchColor;
  }

  /**
   * Download image from data URL
   */
  private static downloadImage(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export canvas to clipboard
   */
  static async exportToClipboard(canvasElement: HTMLElement): Promise<void> {
    try {
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            console.log('Image copied to clipboard');
          } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            throw new Error('Failed to copy to clipboard');
          }
        }
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      throw new Error('Failed to copy to clipboard');
    }
  }

  /**
   * Export with custom dimensions
   */
  static async exportWithDimensions(
    canvasElement: HTMLElement,
    width: number,
    height: number,
    filename = 'design'
  ): Promise<string> {
    try {
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#ffffff',
        scale: 1,
        useCORS: true,
        allowTaint: true,
        width,
        height,
      });

      const dataUrl = canvas.toDataURL('image/png');
      this.downloadImage(dataUrl, `${filename}.png`);
      
      return dataUrl;
    } catch (error) {
      console.error('Error exporting with custom dimensions:', error);
      throw new Error('Failed to export with custom dimensions');
    }
  }

  /**
   * Get image dimensions from canvas
   */
  static getImageDimensions(canvasElement: HTMLElement): { width: number; height: number } {
    return {
      width: canvasElement.offsetWidth,
      height: canvasElement.offsetHeight,
    };
  }
}
