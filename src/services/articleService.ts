import { User } from '../models/User';
import { Article, ArticleModel } from '../models/Article';
import slugify from 'slugify';

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

  console.log(returnArticle);

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
