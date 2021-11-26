import { VideoPlayer } from "./VideoPlayer.js";
import { paths } from "./routes.js"

const resolution = '720p'

const videoPlayer = new VideoPlayer(paths, 'divVideo')

videoPlayer.setResolution(resolution)
videoPlayer.makeSense()