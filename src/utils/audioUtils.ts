/**
 * Audio Utilities for Gemini Transcription and Live API
 */

// Convert Float32Array from AudioContext to 16-bit PCM Linear Base64
export function float32ToPcm16Base64(inputData: Float32Array): string {
  const buffer = new ArrayBuffer(inputData.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < inputData.length; i++) {
    // Clamp to -1 .. 1
    const s = Math.max(-1, Math.min(1, inputData[i]));
    // Convert to 16-bit signed integer (little-endian)
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 16-bit PCM at 24kHz back to AudioBuffer
export function pcm16Base64ToAudioBuffer(
  base64Data: string,
  audioCtx: AudioContext,
  sampleRate: number = 24000
): AudioBuffer {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const dataView = new DataView(bytes.buffer);
  const numSamples = Math.floor(len / 2);
  const audioBuffer = audioCtx.createBuffer(1, numSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  for (let i = 0; i < numSamples; i++) {
    const int16 = dataView.getInt16(i * 2, true);
    // Normalize to -1.0 .. 1.0
    channelData[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff;
  }

  return audioBuffer;
}

// Convert Blob to Base64 data string
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
