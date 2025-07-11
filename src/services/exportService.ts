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
      // Find the actual canvas content area
      const canvasContent = canvasElement.querySelector('.canvas-area') || canvasElement;
      
      // Create a clone of the canvas content to avoid modifying the original
      const clonedContent = canvasContent.cloneNode(true) as HTMLElement;
      
      // Convert all oklch colors in the clone with comprehensive approach
      const allElements = clonedContent.querySelectorAll('*');
      allElements.forEach(el => {
        try {
          const htmlEl = el as HTMLElement;
          const computedStyle = window.getComputedStyle(htmlEl);
          
          // Convert oklch colors to standard colors with safety checks
          ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'].forEach(prop => {
            try {
              const value = computedStyle.getPropertyValue(prop);
              if (value && value.includes('oklch')) {
                const convertedColor = this.convertOklchToHex(value);
                htmlEl.style.setProperty(prop, convertedColor, 'important');
              }
            } catch (propError) {
              console.warn(`Error converting ${prop}:`, propError);
              // Set a safe fallback color for this property
              const fallbackColors = {
                'color': '#000000',
                'backgroundColor': '#ffffff', 
                'borderColor': '#cccccc',
                'fill': '#000000',
                'stroke': '#000000'
              };
              htmlEl.style.setProperty(prop, fallbackColors[prop as keyof typeof fallbackColors] || '#000000', 'important');
            }
          });
          
          // Also check inline styles with error handling
          if (htmlEl.style) {
            for (let i = 0; i < htmlEl.style.length; i++) {
              try {
                const property = htmlEl.style[i];
                const value = htmlEl.style.getPropertyValue(property);
                if (value && value.includes('oklch')) {
                  const convertedColor = this.convertOklchToHex(value);
                  htmlEl.style.setProperty(property, convertedColor, 'important');
                }
              } catch (styleError) {
                console.warn('Error processing inline style:', styleError);
                // Continue processing other styles
              }
            }
          }
        } catch (elementError) {
          console.warn('Error processing element:', elementError);
          // Continue processing other elements
        }
      });
      
      // Temporarily append clone to document for html2canvas
      clonedContent.style.position = 'absolute';
      clonedContent.style.left = '-9999px';
      clonedContent.style.top = '-9999px';
      document.body.appendChild(clonedContent);
      
      // Configure html2canvas options with better settings
      const options = {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        logging: false,
        width: clonedContent.scrollWidth,
        height: clonedContent.scrollHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollX: 0,
        scrollY: 0,
      };

      // Capture canvas using the clone
      const canvas = await html2canvas(clonedContent, options);
      
      // Remove the clone from document
      document.body.removeChild(clonedContent);
      
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
      throw new Error('Failed to export image. Please try again.');
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

  /**
   * Convert oklch color to hex with robust fallback system
   */
  static convertOklchToHex(oklchColor: string): string {
    if (!oklchColor) {
      return '#000000'; // Default fallback
    }
    
    // If it's already a valid hex/rgb/named color, return as is
    if (!oklchColor.includes('oklch')) {
      return oklchColor;
    }
    
    try {
      // Multiple fallback strategies to ensure we always return a valid color
      
      // Strategy 1: Try to parse oklch values
      const oklchPatterns = [
        /oklch\((\d*\.?\d+)%?\s+(\d*\.?\d+)\s+(\d*\.?\d+)(?:\s*\/\s*(\d*\.?\d+))?\)/,
        /oklch\((\d*\.?\d+)\s+(\d*\.?\d+)\s+(\d*\.?\d+)\)/,
        /oklch\((\d*\.?\d+)%?\)/
      ];
      
      for (const pattern of oklchPatterns) {
        const matches = oklchColor.match(pattern);
        if (matches) {
          const lightness = parseFloat(matches[1]);
          
          // Convert lightness to grayscale with safety checks
          if (isNaN(lightness)) break;
          
          let normalizedL = lightness;
          if (lightness > 1) {
            normalizedL = lightness / 100; // Convert percentage
          }
          
          // Map lightness to hex grayscale values
          const grayValue = Math.max(0, Math.min(255, Math.round(normalizedL * 255)));
          const hex = grayValue.toString(16).padStart(2, '0');
          return `#${hex}${hex}${hex}`;
        }
      }
      
      // Strategy 2: Simple string-based fallbacks
      const stringMappings = {
        'oklch(1': '#ffffff',
        'oklch(0.98': '#f8f8f8', 
        'oklch(0.96': '#f5f5f5',
        'oklch(0.94': '#f0f0f0',
        'oklch(0.9': '#e5e5e5',
        'oklch(0.8': '#cccccc',
        'oklch(0.7': '#b3b3b3',
        'oklch(0.6': '#999999',
        'oklch(0.5': '#808080',
        'oklch(0.4': '#666666',
        'oklch(0.3': '#4d4d4d',
        'oklch(0.2': '#333333',
        'oklch(0.1': '#1a1a1a',
        'oklch(0.0': '#000000',
        'oklch(0 ': '#000000'
      };
      
      for (const [pattern, color] of Object.entries(stringMappings)) {
        if (oklchColor.includes(pattern)) {
          return color;
        }
      }
      
      // Strategy 3: Color name fallbacks
      const colorNameMappings = {
        'blue': '#0066cc',
        'red': '#cc0000', 
        'green': '#00cc00',
        'purple': '#6600cc',
        'yellow': '#ffcc00',
        'orange': '#ff6600',
        'pink': '#ff99cc',
        'cyan': '#00cccc',
        'gray': '#808080',
        'grey': '#808080',
        'white': '#ffffff',
        'black': '#000000'
      };
      
      const lowerColor = oklchColor.toLowerCase();
      for (const [name, color] of Object.entries(colorNameMappings)) {
        if (lowerColor.includes(name)) {
          return color;
        }
      }
      
      // Strategy 4: Extract any numbers and use them
      const numbers = oklchColor.match(/\d+\.?\d*/g);
      if (numbers && numbers.length > 0) {
        const firstNum = parseFloat(numbers[0]);
        if (!isNaN(firstNum)) {
          let normalized = firstNum;
          if (firstNum > 1) normalized = firstNum / 100;
          if (firstNum > 100) normalized = firstNum / 255;
          
          normalized = Math.max(0, Math.min(1, normalized));
          const grayValue = Math.round(normalized * 255);
          const hex = grayValue.toString(16).padStart(2, '0');
          return `#${hex}${hex}${hex}`;
        }
      }
      
      // Final fallback: medium gray
      return '#808080';
      
    } catch (error) {
      console.warn('OKLCH conversion error, using fallback:', error);
      return '#808080'; // Safe fallback color
    }
  }
}
