import { Link } from 'react-router-dom';

const ArticleCard = ({ article, category }) => {
  return (
    <Link to={`/article/${category}/${article.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border-l-4 border-saffron hover:scale-105 hover:border-maroon cursor-pointer">
        <h3 className="text-xl font-bold text-maroon mb-2 hover:text-saffron transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {(article.content ?? '').substring(0, 120)}...
        </p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-warmBrown font-medium">{article.date}</span>
          <span className="text-saffron font-semibold hover:underline">
            पूरा पढ़ें →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;

