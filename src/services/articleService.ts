import { User, UserModel } from '../models/User';
import { Article, ArticleModel } from '../models/Article';
import slugify from 'slugify';
import HttpException from '../utils/http-exception.model';
import { Comment, CommentModel } from '../models/Comment';

export const getArticles = async (query: any, id: string | undefined) => {
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;

  const queryArticles: any = {};

  if (query.tag) {
    queryArticles.tagList = { $in: [query.tag] };
  }

  const authorQuery = [];
  if (id) {
    authorQuery.push(id);
  }

  if (query.author) {
    const author = await UserModel.findOne({ username: query.author });

    if (author) {
      authorQuery.push(author._id);
    }

    queryArticles.author = { $in: authorQuery };
  }

  if (query.favorited) {
    const favoriter = await UserModel.findOne({ username: query.favorited });

    if (favoriter) {
      queryArticles.favoritedBy = favoriter._id;
    } else {
      queryArticles.favoritedBy = null;
    }
  }

  const filteredArticles = await ArticleModel.find(queryArticles)
    .populate<User>({
      path: 'author',
      select: ['username', 'bio', 'image', 'followedBy'],
    })
    .skip(Number(offset))
    .limit(Number(limit));

  const mapArticles = filteredArticles.map((filteredArticle) => {
    const isFavorited = filteredArticle.favoritedBy.some(
      (favoritedUser) => favoritedUser.toHexString() === id
    );

    const isFollowing = (
      filteredArticle?.author as User | null
    )?.followedBy.some((followingUser) => followingUser._id === id);

    return {
      slug: filteredArticle.slug,
      title: filteredArticle.title,
      description: filteredArticle.description,
      body: filteredArticle.body,
      tagList: filteredArticle.tagList,
      createdAt: filteredArticle.createdAt,
      updatedAt: filteredArticle.updatedAt,
      favorited: isFavorited,
      favoritesCount: filteredArticle.favoritesCount,
      author: {
        bio: (filteredArticle?.author as User | null)?.bio,
        image: (filteredArticle?.author as User | null)?.image,
        username: (filteredArticle?.author as User | null)?.username,
        following: isFollowing,
      },
    };
  });
  const articlesCount = await ArticleModel.countDocuments(queryArticles);

  return {
    articles: mapArticles,
    articlesCount: articlesCount,
  };
};

export const createArticle = async (article: Article, id: string) => {
  // TODO: Check something here
  // require: title, body, description

  const newArticle = await ArticleModel.create({
    ...article,
    // using slugify for auto generate slug
    slug: slugify(article.title, { lower: true }),
    author: id,
    favorited: false,
    favoritesCount: 0,
  });

  await ArticleModel.create();

  const returnArticle = await newArticle.populate<User>({
    path: 'author',
    select: ['username', 'bio', 'image', 'followedBy'],
  });

  const isFollowing = (returnArticle?.author as User | null)?.followedBy.some(
    (followingUser) => followingUser._id === id
  );

  return {
    article: {
      slug: returnArticle.slug,
      title: returnArticle.title,
      description: returnArticle.description,
      body: returnArticle.body,
      tagList: returnArticle.tagList,
      createdAt: returnArticle.createdAt,
      updatedAt: returnArticle.updatedAt,
      favorited: returnArticle.favorited,
      favoritesCount: returnArticle.favoritesCount,
      author: {
        bio: (returnArticle?.author as User | null)?.bio,
        image: (returnArticle?.author as User | null)?.image,
        username: (returnArticle?.author as User | null)?.username,
        following: isFollowing,
      },
    },
  };
};

export const deleteArticle = async (slug: string, id: string | undefined) => {
  if (!id) {
    throw new HttpException(403, 'Not authen');
  }

  const article = await ArticleModel.findOne({ slug });

  if (!article) {
    throw new HttpException(403, 'Not find article');
  }

  if (article.author?.toHexString() !== id) {
    throw new HttpException(403, 'Cannot delete');
  }

  await ArticleModel.deleteOne({ slug });
};

export const updateArticle = async (
  slug: string,
  updateArticle: Article,
  id: string | undefined
) => {
  if (!id) {
    throw new HttpException(403, 'Not authen');
  }

  const article = await ArticleModel.findOne({ slug });

  if (!article) {
    throw new HttpException(403, 'Not found article');
  }

  if (article.author?.toHexString() !== id) {
    throw new HttpException(403, 'Cannot delete');
  }

  const updatedArticle = await ArticleModel.findOneAndUpdate(
    { slug },
    updateArticle,
    { new: true }
  );

  return updatedArticle;
};

export const createComment = async (
  slug: string,
  comment: Comment,
  id: string | undefined
) => {
  if (!id) {
    throw new HttpException(403, 'Not authen');
  }

  if (!comment) {
    throw new HttpException(403, 'Cannot create');
  }

  const article = await ArticleModel.findOne({ slug });

  if (!article) {
    throw new HttpException(403, 'Not found article');
  }

  const newComment = await CommentModel.create({
    body: comment.body,
    article: article.id,
    author: id,
  });

  await ArticleModel.findOneAndUpdate(
    { id: article.id },
    { $push: { comments: newComment.id } }
  );

  const returnComment = await newComment.populate<Comment>({
    path: 'author',
    select: ['username', 'bio', 'image', 'followedBy'],
  });

  const isFollowing = (returnComment?.author as User | null)?.followedBy.some(
    (followingUser) => followingUser._id === id
  );

  return {
    id: returnComment.id,
    createdAt: returnComment.createdAt,
    updatedAt: returnComment.updatedAt,
    body: returnComment.body,
    author: {
      username: (returnComment.author as User | null)?.username,
      bio: (returnComment.author as User | null)?.bio,
      image: (returnComment.author as User | null)?.image,
      following: isFollowing,
    },
  };
};

export const getComments = async (slug: string, id: string) => {
  const article = await ArticleModel.findOne({ slug });

  if (!article) {
    throw new HttpException(403, 'Not found article');
  }

  const comments = await CommentModel.find({
    article: article.id,
  }).populate<Comment>({
    path: 'author',
    select: ['username', 'bio', 'image', 'followedBy'],
  });

  const returnComments = comments.map((comment) => {
    const isFollowing = (comment?.author as User | null)?.followedBy.some(
      (followingUser) => followingUser._id === id
    );
    return {
      id: comment.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      body: comment.body,
      author: {
        username: (comment.author as User | null)?.username,
        bio: (comment.author as User | null)?.bio,
        image: (comment.author as User | null)?.image,
        following: isFollowing,
      },
    };
  });

  return returnComments;
};

export const deleteComment = async (
  slug: string,
  userId: string,
  commentId: string
) => {
  const article = await ArticleModel.findOne({ slug });

  if (!article) {
    throw new HttpException(403, 'Not found article');
  }

  if (!userId) {
    throw new HttpException(403, 'Not authen');
  }

  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    throw new HttpException(403, 'Cannot delete comment');
  }

  if (comment.author?.toHexString() !== userId) {
    throw new HttpException(403, 'Cannot delete comment');
  }

  await CommentModel.deleteOne({ _id: commentId });

  await ArticleModel.findOneAndUpdate(
    { slug },
    { $pull: { comments: commentId } }
  );
};

export const favoriteArticle = async (slug: string, id: string) => {
  const article = await ArticleModel.findOne({ slug });

  if (!article) {
    throw new HttpException(403, 'Not found article');
  }

  if (!id) {
    throw new HttpException(403, 'Not authen');
  }

  const returnArticle = await ArticleModel.findOneAndUpdate(
    { slug },
    { $push: { favoritedBy: id }, $inc: { favoritesCount: 1 } },
    { new: true }
  ).populate({
    path: 'author',
    select: ['username', 'bio', 'image', 'followedBy'],
  });

  if (!returnArticle) {
    throw new HttpException(403, 'Not found article');
  }

  const isFollowing = (returnArticle?.author as User | null)?.followedBy.some(
    (followingUser) => followingUser._id === id
  );

  return {
    article: {
      slug: returnArticle.slug,
      title: returnArticle.title,
      description: returnArticle.description,
      body: returnArticle.body,
      tagList: returnArticle.tagList,
      createdAt: returnArticle.createdAt,
      updatedAt: returnArticle.updatedAt,
      favorited: true,
      favoritesCount: returnArticle.favoritesCount,
      author: {
        bio: (returnArticle?.author as User | null)?.bio,
        image: (returnArticle?.author as User | null)?.image,
        username: (returnArticle?.author as User | null)?.username,
        following: isFollowing,
      },
    },
  };
};

export const unfavoriteArticle = async (slug: string, id: string) => {
  const article = await ArticleModel.findOne({ slug });

  if (!article) {
    throw new HttpException(403, 'Not found article');
  }

  if (!id) {
    throw new HttpException(403, 'Not authen');
  }

  const returnArticle = await ArticleModel.findOneAndUpdate(
    { slug },
    { $pull: { favoritedBy: id }, $inc: { favoritesCount: -1 } },
    { new: true }
  ).populate({
    path: 'author',
    select: ['username', 'bio', 'image', 'followedBy'],
  });

  if (!returnArticle) {
    throw new HttpException(403, 'Not found article');
  }

  const isFollowing = (returnArticle?.author as User | null)?.followedBy.some(
    (followingUser) => followingUser._id === id
  );

  return {
    article: {
      slug: returnArticle.slug,
      title: returnArticle.title,
      description: returnArticle.description,
      body: returnArticle.body,
      tagList: returnArticle.tagList,
      createdAt: returnArticle.createdAt,
      updatedAt: returnArticle.updatedAt,
      favorited: false,
      favoritesCount: returnArticle.favoritesCount,
      author: {
        bio: (returnArticle?.author as User | null)?.bio,
        image: (returnArticle?.author as User | null)?.image,
        username: (returnArticle?.author as User | null)?.username,
        following: isFollowing,
      },
    },
  };
};

export const getFeed = async (query: any, id: string) => {
  if (!id) {
    throw new HttpException(403, 'Not authen');
  }

  const limit = Number(query.limit) || 20;
  const offset = Number(query.offset) || 0;

  const user = await UserModel.findById(id);

  const feeds = await ArticleModel.find({
    author: { $in: user?.following },
  })
    .populate({
      path: 'author',
      select: ['username', 'bio', 'image', 'followedBy'],
    })
    .limit(limit)
    .skip(offset);

  return {
    articles: feeds.map((feed) => {
      return {
        slug: feed.slug,
        title: feed.title,
        description: feed.description,
        body: feed.body,
        tagList: feed.tagList,
        createdAt: feed.createdAt,
        updatedAt: feed.updatedAt,
        favorited: true,
        favoritesCount: feed.favoritesCount,
        author: {
          bio: (feed?.author as User | null)?.bio,
          image: (feed?.author as User | null)?.image,
          username: (feed?.author as User | null)?.username,
          following: true,
        },
      };
    }),
    articlesCount: feeds.length,
  };
};

export const getTags = async () => {
  const tags = await ArticleModel.find().distinct('tagList');

  return {
    tags,
  };
};
