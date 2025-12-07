// utils/encryption.ts - UPDATED & FIXED
export interface SensitiveTransactionData {
  amount: number;
  description: string;
}

export class TransactionEncryption {
  private userKey: CryptoKey | null = null;
  private salt: Uint8Array | null = null;

  // Initialize with user's password
  async initialize(userId: string, password: string): Promise<{ salt: string }> {
    try {
      // Generate a unique salt for this user
      this.salt = crypto.getRandomValues(new Uint8Array(16));
      
      const encoder = new TextEncoder();
      
      // Create key material from password
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      );
      
      // Derive key with high iteration count for security
      this.userKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: this.salt,
          iterations: 310000, // OWASP recommended minimum
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
      
      // Return salt as base64 to store in user profile
      return {
        salt: this.arrayBufferToBase64(this.salt)
      };
      
    } catch (error) {
      console.error('Encryption initialization failed:', error);
      throw new Error('Failed to initialize encryption');
    }
  }

  // Initialize with existing salt (for returning users)
  async initializeWithSalt(userId: string, password: string, saltBase64: string): Promise<void> {
    try {
      const encoder = new TextEncoder();
      const salt = this.base64ToArrayBuffer(saltBase64);
      
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      );
      
      this.userKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 310000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
      
      this.salt = salt;
      
    } catch (error) {
      console.error('Encryption initialization with salt failed:', error);
      throw new Error('Failed to initialize encryption with salt');
    }
  }

  // Encrypt sensitive transaction data
  async encryptTransaction(data: SensitiveTransactionData): Promise<{
    encryptedPayload: string;
    encryptionKey: string;
    iv: string;
  }> {
    if (!this.userKey) {
      throw new Error('Encryption not initialized. Call initialize() first.');
    }
    
    try {
      // Generate random initialization vector
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Convert data to JSON string
      const jsonData = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonData);
      
      // Encrypt the data
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.userKey,
        dataBuffer
      );
      
      // Return encrypted data, key, and IV as base64 strings
      return {
        encryptedPayload: this.arrayBufferToBase64(encrypted),
        encryptionKey: this.arrayBufferToBase64(iv), // Using IV as the key identifier
        iv: this.arrayBufferToBase64(iv)
      };
      
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt transaction data
  async decryptTransaction(encryptedPayload: string, iv: string): Promise<SensitiveTransactionData> {
    if (!this.userKey) {
      throw new Error('Encryption not initialized. Call initialize() first.');
    }
    
    try {
      // Convert base64 strings back to ArrayBuffers
      const encryptedData = this.base64ToArrayBuffer(encryptedPayload);
      const ivData = this.base64ToArrayBuffer(iv);
      
      // Decrypt the data
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivData
        },
        this.userKey,
        encryptedData
      );
      
      // Convert decrypted data back to JSON
      const decoder = new TextDecoder();
      const jsonString = decoder.decode(decrypted);
      return JSON.parse(jsonString);
      
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data. Wrong password or corrupted data?');
    }
  }

  // Helper method to convert ArrayBuffer to base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Helper method to convert base64 to ArrayBuffer
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  isInitialized(): boolean {
    return this.userKey !== null;
  }

  clear() {
    this.userKey = null;
    this.salt = null;
  }
}