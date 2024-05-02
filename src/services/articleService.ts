import { User } from '../models/User';
import { Article, ArticleModel } from '../models/Article';
import slugify from 'slugify';
import HttpException from '../utils/http-exception.model';

export const getArticles = async (query: any, id: string | undefined) => {
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;

  const queryArticles: any = {};
  console.log(query);

  if (query.tag) {
    queryArticles.tagList = { $in: [query.tag] };
  }

  if (query.author) {
    const author = await ArticleModel.findOne({ username: query.author });

    if (author) {
      queryArticles.author = author._id;
    }
  }

  if (query.favorited) {
    const favoriter = await ArticleModel.findOne({ username: query.favorited });

    if (favoriter) {
      queryArticles.favoritedBy = favoriter._id;
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

  await article.deleteOne({ slug });
};
