export const GameSystem = {
  characters: {
    girl: {
      name: "girl",
      path: "/src/model/girl/girl.fbx",
      animations: [
        "/src/model/girl/animation/standing.fbx",
        "/src/model/girl/animation/hiphop1.fbx",
        "/src/model/girl/animation/hiphop2.fbx",
        "/src/model/girl/animation/hiphop3.fbx",
        "/src/model/girl/animation/hiphop4.fbx",
        "/src/model/girl/animation/hiphop5.fbx",
        "/src/model/girl/animation/util1.fbx",
        "/src/model/girl/animation/util2.fbx",
      ],
    },
    zombie: {
      name: "zombie",
      path: "/src/model/zombie/zombie.fbx",
      animations: [
        "/src/model/zombie/animation/standing.fbx",
        "/src/model/zombie/animation/hiphop1.fbx",
      ],
    },
  },
  stage: [{ name: "school", path: "/src/model/stage/stage_1/scene.gltf" }],
  position: {
    1: [1],
    2: [-100, 100],
  },
  target: {
    point: 1800,
    perfect: 100,
    cool: 200,
  },
  point: 1000,
};
