import { type CanvasRenderingContext2D, loadImage } from 'canvas';
import type { Dimensions, Styles } from '../../data';
import type { ParsedDeparture } from '../../data/transit';

export async function drawTransitInfo(
  ctx: CanvasRenderingContext2D,
  transitData: ParsedDeparture[],
  dimensions: Dimensions
) {
  const { width, height } = dimensions;

  const ownHeight = height * 0.2;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, height - ownHeight, width, ownHeight);

  const trainI = await loadImage(import.meta.dirname + '/train.png');
  const busI = await loadImage(import.meta.dirname + '/bus.png');

  const infoHeight = ownHeight * 0.8;
  const infoY = height - ownHeight + (ownHeight - infoHeight) / 2;
  const itemWidth = 90;
  const iconSize = 30;
  const padding = 8;

  let x = padding;
  for (const item of transitData) {
    const icon = item.type === 'train' ? trainI : busI;
    ctx.drawImage(icon, x, infoY + padding - 5, iconSize, iconSize);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(
      `${item.departureMinutes}`,
      x + itemWidth / 2,
      infoY + padding * 2.5
    );

    x += itemWidth;
  }
}
