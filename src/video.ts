import "./style.css";

function init() {
  const video = document.querySelector("video")!;
  // const canvas = document.querySelector("canvas")!;

  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;

  const constraints = {
    audio: false,
    video: {
      width: { max: 1075 },
      height: { max: 1075 },
      facingMode: { ideal: "environment" },
    },
  };

  function handleSuccess(stream: MediaStream) {
    video.srcObject = stream;
  }

  function handleError(error: Error) {
    console.log("navigator.getUserMedia error: ", error);
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(handleSuccess)
    .catch(handleError);

  document
    .querySelector("#debug")
    ?.addEventListener("click", () => window.location.reload());

  // document.querySelector(".button")?.addEventListener("touchstart", (e) => {
  //   const target = e.target as HTMLButtonElement;
  //   target.classList.add("hover");
  // });

  // document.querySelector(".button")?.addEventListener("touchend", (e) => {
  //   const target = e.target as HTMLButtonElement;
  //   target.classList.remove("hover");
  // });
}

document.addEventListener("DOMContentLoaded", init);
