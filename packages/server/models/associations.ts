import Maker from "./Maker";
import BoardGame from "./BoardGame";
import Library from "./Library";
import BlockComment from "./BlockComment";
import GenreGame from "./GenreGame";
import User from "./User";
import Comment from "./Comment";
import City from "./City";
import Complaint from "./Complaint";
import FavouriteGenre from "./FavouriteGenre";
import Genre from "./Genre";
import Request from "./Request";
import Subscription from "./Subscription";

//связи таблицы BoardGame
BoardGame.belongsTo(Maker, {
  foreignKey: "maker_id",
  as: "maker",
});

BoardGame.hasMany(Library, {
  foreignKey: "game_id",
  as: "libraries",
});

BoardGame.hasMany(BlockComment, {
  foreignKey: "game_id",
  as: "blockscomments",
});

BoardGame.hasMany(GenreGame, {
  foreignKey: "game_id",
  as: "genresgame",
});

//связи таблицы Maker
Maker.hasMany(BoardGame, {
  foreignKey: "maker_id",
  as: "boardgames",
});

//связи таблицы BlockComment
BlockComment.belongsTo(BoardGame, {
  foreignKey: "game_id",
  as: "game",
});

BlockComment.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

BlockComment.hasMany(Comment, {
  foreignKey: "blockComment_id",
  as: "comments",
});

//связи таблицы City
City.hasMany(User, {
  foreignKey: "city_id",
  as: "users",
});

//связи таблицы Comment
Comment.belongsTo(BlockComment, {
  foreignKey: "blockComment_id",
  as: "blockComment",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

//связи таблицы Complaint
Complaint.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Complaint.belongsTo(Comment, {
  foreignKey: "comment_id",
  as: "comment",
});

//связи таблицы FavouriteGenre
FavouriteGenre.belongsTo(Genre, {
  foreignKey: "genre_id",
  as: "genre",
});

FavouriteGenre.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

//связи таблицы Genre
Genre.hasMany(FavouriteGenre, {
  foreignKey: "genre_id",
  as: "favouritegenres",
});

Genre.hasMany(GenreGame, {
  foreignKey: "genre_id",
  as: "genregames",
});

//связи таблицы GenreGame
GenreGame.belongsTo(Genre, {
  foreignKey: "genre_id",
  as: "genre",
});

GenreGame.belongsTo(BoardGame, {
  foreignKey: "game_id",
  as: "game",
});

//связи таблицы Library
Library.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Library.belongsTo(BoardGame, {
  foreignKey: "game_id",
  as: "game",
});

//связи таблицы Request
Request.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

//связи таблицы User
User.belongsTo(City, {
  foreignKey: "city_id",
  as: "city",
});

User.hasMany(Request, {
  foreignKey: "user_id",
  as: "requests",
});

User.hasMany(Library, {
  foreignKey: "user_id",
  as: "libraries",
});

User.hasMany(BlockComment, {
  foreignKey: "user_id",
  as: "blockscomments",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
  as: "comments",
});

User.hasMany(Complaint, {
  foreignKey: "user_id",
  as: "complaints",
});

User.hasMany(FavouriteGenre, {
  foreignKey: "user_id",
  as: "favouritegenres",
});

User.hasMany(Subscription, {
  foreignKey: "user_id",
  as: "subscriptions",
});

//связи таблицы Subscription
Subscription.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});
