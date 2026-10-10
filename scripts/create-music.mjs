// Pieza instrumental original, generada localmente. Piano suave en cuatro acordes.
import { writeFile } from "node:fs/promises";
const sampleRate = 44100;
const beat = 60 / 72;
const bar = beat * 4;
const duration = bar * 12;
const samples = new Float64Array(Math.ceil(sampleRate * duration));
let randomSeed = 28;
const random = () => { randomSeed = (Math.imul(randomSeed, 1664525) + 1013904223) >>> 0; return randomSeed / 4294967296; };
const chords = [[50,57,61,66],[47,54,57,62],[43,50,54,59],[45,52,56,61]];
const addNote = (midi, start, velocity, length = 3.4) => {
  const frequency = 440 * 2 ** ((midi - 69) / 12);
  const phases = Array.from({length:7}, () => random() * Math.PI * 2);
  const offset = Math.floor(start * sampleRate);
  for (let i = 0; i < length * sampleRate; i++) {
    const t = i / sampleRate;
    const index = (offset + i) % samples.length;
    const attack = 1 - Math.exp(-t * 210);
    const envelope = attack * Math.exp(-t * 1.6) * Math.min(1, (length - t) * 5);
    let wave = 0;
    for (let h = 1; h <= 7; h++) {
      wave += Math.sin(2 * Math.PI * frequency * h * (1 + h * h * 0.00008) * t + phases[h-1]) * (1 / h ** 2.1) * Math.exp(-t * h * 0.38);
    }
    samples[index] += wave * envelope * velocity;
  }
};
for (let b = 0; b < 12; b++) {
  const chord = chords[b % 4];
  const start = b * bar;
  addNote(chord[0] - 12, start, .18, 4.8);
  chord.forEach((note, j) => addNote(note, start + j * .026, .09, 3.2));
  [2,1,3,2,1,2].forEach((j, k) => addNote(chord[j] + 12, start + (k + 1) * beat / 2, .12 + (k % 3) * .014, 2.9));
  if (b % 2 === 1) addNote(chord[3] + 12, start + beat * 3.25, .10, 3.3);
}
// Reverberación discreta con retardos cortos, integrados en el bucle.
const dry = samples.slice();
for (const [seconds, gain] of [[.073,.1],[.131,.08],[.211,.06],[.347,.04]]) {
  const delay = Math.round(seconds * sampleRate);
  for (let i = 0; i < dry.length; i++) samples[(i + delay) % samples.length] += dry[i] * gain;
}
const buffer = Buffer.alloc(44 + samples.length * 2);
buffer.write("RIFF",0);buffer.writeUInt32LE(buffer.length-8,4);buffer.write("WAVEfmt ",8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);buffer.writeUInt32LE(sampleRate,24);buffer.writeUInt32LE(sampleRate*2,28);buffer.writeUInt16LE(2,32);buffer.writeUInt16LE(16,34);buffer.write("data",36);buffer.writeUInt32LE(samples.length*2,40);
for (let i=0;i<samples.length;i++) buffer.writeInt16LE(Math.round(Math.tanh(samples[i] * 1.25) * 27000),44+i*2);
await writeFile("dist/assets/soiree.wav",buffer);
console.log(`Música original: ${duration.toFixed(1)} segundos.`);
