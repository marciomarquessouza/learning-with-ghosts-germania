/**
 * 1 - An empty array (monoOutput) of Float32, the size of the audio buffer, is created to receive the compressed track in a single channel with normalized (mono) values.
 * 2 - A loop is performed through all channels of the Audio Buffer where the data from each channel is transferred to channelData.
 * 3 - A second loop, internal to the loop mentioned above, has an index initialized to run through the entire array of channel data.
 * 4 - This index positions the Float32 out array and performs an addition of the current value of this audio buffer item divided by the number of channels.
 * ----
 * Example with a smaller number of data:
 * Let's say the audioBuffer has 2 channels with the following values:
 * channel 1 = [0.5, 0.2, 0.8]
 * channel 2 = [0.1, 0.9, 0.7]
 * The final value will be the sum of the two channels divided by 2 (number of channels), being then:
 * channel 1 divided by the number of channels (2) = [0.25, 0.1, 0.4]
 * channel 2 divided by the number of channels (2) = [0.05, 0.45, 0.35]
 * sum of the two channels divided = [0.3, 0.55, 0.75]
 * In summary, an average is taken between the values ​​of each channel.
 */
export function downmix(audioBuffer: AudioBuffer): Float32Array {
  const monoOutput = new Float32Array(audioBuffer.length);
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let index = 0; index < channelData.length; index++) {
      monoOutput[index] += channelData[index] / audioBuffer.numberOfChannels;
    }
  }

  return monoOutput;
}
