import Phaser from 'phaser';

// Define a type for the tile data
type TileData = {
  [tileid: string]: {
    animation: AnimationFrame[];
  };
};

// Define types for tile animation data
type AnimationFrame = {
  tileid: number;
  duration: number;
};

// Define the structure for each animated tile
type AnimatedTile = {
  tile: Phaser.Tilemaps.Tile;
  tileAnimationData: AnimationFrame[];
  firstgid: number;
  elapsedTime: number;
};

// Type for the collection of animated tiles
type AnimatedTileLayer = {
  tiles: AnimatedTile[];
};

// Utility function to handle the animation of tiles
const updateAnimateTiles = (delta: number, animatedTileLayer: AnimatedTileLayer) => {
  animatedTileLayer.tiles.forEach((animatedTile) => {
    const { tile, tileAnimationData, firstgid } = animatedTile;

    if (!tileAnimationData) return;

    animatedTile.elapsedTime += delta;

    let animationDuration = 0;
    let frameIndex = 0;

    // Find the correct frame based on elapsedTime
    for (let i = 0; i < tileAnimationData.length; i++) {
      animationDuration += tileAnimationData[i].duration;
      if (animatedTile.elapsedTime < animationDuration) {
        frameIndex = i;
        break;
      }
    }

    // Wrap elapsedTime if we passed the total animation duration
    if (animatedTile.elapsedTime >= animationDuration) {
      animatedTile.elapsedTime %= animationDuration;
      frameIndex = 0;
    }

    // Update the tile index with the correct frame
    tile.index = tileAnimationData[frameIndex].tileid + firstgid;

    // Update the tilemap to visually reflect changes (if necessary)
    if (tile.index !== tile.layer.data[tile.y][tile.x].index) {
      tile.layer.tilemapLayer.putTileAt(tile.index, tile.x, tile.y);
    }
  });
};

// Utility function to initialize animated tiles within the scene
const createAnimatedTiles = (scene: Phaser.Scene, tilemap: Phaser.Tilemaps.Tilemap) => {
  // Initialize an array to store all animated tiles in the scene
  const animatedTiles: AnimatedTile[] = [];

  // Iterate over each tileset in the map
  tilemap.tilesets.forEach((tileset) => {
    const { firstgid, tileData } = tileset;

    // Check if the tileset has tile data
    if (!tileData) {
      console.warn(`No tile data found for tileset: ${tileset.name}`);
      return;
    }

    // Type assertion for tileData
    const tileDataTyped = tileData as TileData;

    // Iterate over each tile ID in the tile data
    for (const tileid in tileDataTyped) {
      const animationData = tileDataTyped[tileid]?.animation;
      if (!animationData) continue; // Skip tiles without animation

      // Check if the tile is present in any of the map's layers
      tilemap.layers.forEach((layer) => {
        layer.data.forEach((tileRow) => {
          tileRow.forEach((tile) => {
            // Match tile by index offset by firstgid
            if (tile.index - firstgid === parseInt(tileid, 10)) {
              // Add the animated tile to the animated tiles array
              animatedTiles.push({
                tile,
                tileAnimationData: animationData,
                firstgid,
                elapsedTime: 0,
              });
            }
          });
        });
      });
    }
  });

  // Attach update logic to the scene's update loop
  scene.events.on('update', (_time: number, delta: number) => {
    updateAnimateTiles(delta, { tiles: animatedTiles });
  });
};

export {
  createAnimatedTiles,
  updateAnimateTiles,
  type TileData,
  type AnimationFrame,
  type AnimatedTile,
  type AnimatedTileLayer,
};
