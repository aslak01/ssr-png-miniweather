import { type CanvasRenderingContext2D, loadImage } from 'canvas';
import type { Dimensions, Styles } from '../../data';
import type { ParsedDeparture } from '../../data/transit';

export async function drawTransitInfo(
  ctx: CanvasRenderingContext2D,
  transitData: ParsedDeparture[],
  dimensions: Dimensions
) {
  const { width, height } = dimensions;

  const ownHeight = height * 0.25;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, height - ownHeight, width, ownHeight);

  // const trainI = await loadImage(import.meta.dirname + '/train.png');
  // const busI = await loadImage(import.meta.dirname + '/bus.png');

  const infoHeight = ownHeight * 0.8; // Height of the info area
  const infoY = height - ownHeight + (ownHeight - infoHeight) / 2; // Y position of info area
  const itemWidth = 80; // Width for each transit item
  const iconSize = 30;
  const padding = 10;

  let x = padding;
  for (const item of transitData) {
    // const icon = item.type === 'train' ? trainI : busI;
    // ctx.drawImage(icon, x, infoY + padding, iconSize, iconSize);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.font = '18px';
    ctx.fillText(
      `${item.name}: ${item.departureMinutes}`,
      x + itemWidth / 2,
      infoY + padding * 2.5
    );

    x += itemWidth;
  }
}
