

class Wall {

  constructor(startPoint, endPoint, height, width, color, texturepath = "", damage = -1, permeation = 1, curvature = 0) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.height = height;
    this.color = 0xff00ff;
    this.damage = damage;
    this.entrances = [];
    this.dimensions = { height, height };
    this.columns = [];
    this.permeation = permeation;
    this.curvature = curvature; // New property for curvature
    this.loader = new THREE.TextureLoader();
    this.texture = loader.load(texturepath) || null;
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshLambertMaterial({ color: this.color });
    const wallMaterial = new THREE.MeshBasicMaterial({ color: this.color });
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(this.startPoint.x, this.startPoint.y, this.startPoint.z),
      new THREE.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z)
    ]);
    const points = curve.getPoints(50);
    this.geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.mesh = new THREE.Line(this.geometry, this.material);
  }

  addEntrance(entrance) {
    this.entrances.push(entrance);
  }

  toJSON() {
    return {
      entrances: this.entrances.map((entrance) => entrance.toJSON()),
    };
  }

  static fromJSON(json) {
    const wall = new Wall();
    wall.entrances = json.entrances.map((entranceJson) => Entrance.fromJSON(entranceJson));
    return wall;
  }

  addColumn(column) {
    this.columns.push(column);
  }

  draw(scene, material) {
    // Implement the logic to draw the wall in the scene using the provided material

    // Create a Three.js mesh for the wall using the geometry and material
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // Set the position and scale of the mesh based on the wall's start and end points
    this.mesh.position.set(this.startPoint.x, this.startPoint.y, this.startPoint.z);
    this.mesh.scale.set(
      Math.abs(this.endPoint.x - this.startPoint.x),
      Math.abs(this.endPoint.y - this.startPoint.y),
      Math.abs(this.endPoint.z - this.startPoint.z)
    );

    // Apply curvature to the wall
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(this.startPoint.x, this.startPoint.y, this.startPoint.z),
      new THREE.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z)
    ]);
    const points = curve.getPoints(50);
    this.geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.mesh = new THREE.Line(this.geometry, this.material);

    // Add the mesh to the scene
    scene.add(this.mesh);
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(0, 1, 1).normalize();
    this.scene.add(this.light);
  }
}

export default Wall;