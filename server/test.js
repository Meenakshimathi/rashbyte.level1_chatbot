const assert = require('assert');
const { getReply } = require('./rules');

const cases = [
  ['hello', 'greeting'],
  ['hi need information about chennai', 'chennai'],
  ['information about chennai', 'chennai'],
  ['Hey there', 'greeting'],
  ['how are you?', 'how_are_you'],
  ['what are your business hours', 'hours'],
  ['where are you located', 'location'],
  ['how much does it cost', 'pricing'],
  ['track my order 98765', 'order_status'],
  ['I want a refund', 'refund'],
  ['tell me a joke', 'joke'],
  ['thanks!', 'thanks'],
  ['bye', 'goodbye'],
  ['asdfghjkl', 'fallback'],
  ['', 'empty'],
];

for (const [input, expected] of cases) {
  const { rule } = getReply(input);
  assert.strictEqual(rule, expected, `"${input}" -> expected ${expected}, got ${rule}`);
}

assert.ok(getReply('order 98765').reply.includes('#98765'));
console.log(`All ${cases.length + 1} tests passed ✅`);
