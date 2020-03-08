#### Designed as `RESTFUL API`

Request flow of a "game loop":  

1. create a [new game](#operation/postGames_v1.0)
2. create a [new game player](#operation/postGamesPlayers_v1.0)
3. create a [frame](#operation/postGamesFrames_v1.0) (before each round) per game per player
4. set frame [hit score](#operation/postFramesThrow_v1.0)
5. repeat from point 3 till the game ends
6. get [player's score](#operation/getPlayer_v1.0)
