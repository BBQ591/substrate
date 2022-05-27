const RAAS_LOCATION = "http://3.86.91.53";
var container;
var options = {
  mode: "tree",
};
var editor;
var scenes;

function initial_render() {
  fetch(`${RAAS_LOCATION}/render/`)
    .then((response) => response.blob())
    .then((blob) => {
      document.querySelector(".render").src = URL.createObjectURL(blob);
    });
}

function get_scene_graph() {
  return fetch(`${RAAS_LOCATION}/sg/`)
    .then((response) => response.json())
    .then((scene_graph) => {
      // NOTE: These commands add extra options to configure OSPRay Studio beyond the normal SceneGraph.
      // To modify the camera, you should use these vectors rather than the transformation vectors.
      scene_graph.camera.position = [0.0, 0.0, 1.0];
      scene_graph.camera.up = [0.0, 1.0, 0.0];
      scene_graph.camera.view = [0.0, 0.0, -1.0];

      scene_graph.resolution = "720p"; // This can be a description of the resolution such as 720p, 4K, 8K, etc, or a width by height such as 1920x1080.
      scene_graph.samples_per_pixel = 1; // The number of samples per pixel to use when rendering.
      editor.set(scene_graph);
      console.log(scene_graph);
      return scene_graph;
    });
}

function re_render(scene_graph) {
  console.log(scene_graph);
  const options = {
    body: JSON.stringify(scene_graph),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  };
  fetch(`${RAAS_LOCATION}/render/`, options)
    .then((response) => response.blob())
    .then((blob) => {
      document.querySelector(".render").src = URL.createObjectURL(blob);
    });
}

function render_movie(key_frames) {
  const options = {
    body: JSON.stringify({
      fps: 10,
      frames: key_frames,
      length: 2,
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  };

  fetch(`${RAAS_LOCATION}/renderMovie/`, options)
    .then((response) => response.blob())
    .then((blob) => {
      const movie_url = URL.createObjectURL(blob);
      // This approach can be used to download the movie: https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link
    });
}

function init() {
  container = document.getElementById("jsoneditor");
  editor = new JSONEditor(container, options);
  scenes = [];
}

function main() {
  init();
  initial_render();
  get_scene_graph();
}

function submit() {
  var scene_graph = editor.get();
  console.log(scenes);
  re_render(scene_graph);
}

function addFrame() {
  var currFrame = get_scene_graph();
  scenes.push(currFrame);
  console.log(scenes);
}

function createMovie() {
  render_movie(scenes);
}
