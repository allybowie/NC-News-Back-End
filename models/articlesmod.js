const connection = require("../db/connection");

exports.selectArticles = (query) => {
  const {sort_by = 'created_at' , order = 'desc', author , topic, limit = 10, p=1} = query
  const validSorts = ["title", "article_id", "author", "topic", "body", "created_at", "votes", "comment_count"]
  const validOrder = ["desc", "asc"]
  const articles = connection.select('*').from('articles')

  return articles.then(article => {
    if(limit < 1 || p < 1){
        return Promise.reject({
          status:400, msg: "We cannot show you a negative number of articles"
        })
      }
      if(!validSorts.includes(sort_by) || !validOrder.includes(order)){
        return Promise.reject({
          status:400, msg: `We cannot sort the articles in the way you have requested. Please try again`
        })
      }
    if(article.length < limit * p - limit + 1){
      return Promise.reject({
        status:404 , msg: "You've reached the end of the articles!"
      })
    } else {
      return connection('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count({comment_count : 'comments.comment_id'})
    .groupBy('articles.article_id')
    .select('articles.*')
    .orderBy(sort_by , order)
    .limit(limit)
    .offset(limit * (p-1))
    .modify(article => {
        if(author) {
          article.where("articles.author", "=", author)
        } 
          
        if(topic) {
          article.where("articles.topic", "=", topic)
        }
      })
    .then(articles => {
      if(articles.length===0 && author && !topic){
        return connection('users')
        .select("*").where('users.username', '=', author)
        .then(author => {
          if(author.length === 0){
            return Promise.reject({
              status: 404, msg: `The author you have requested does not exist`
            })
          } else if (author.length > 0){
            const total_count = article.length
            return {articles, total_count}
          }

        })
      } else if(articles.length===0 && topic && !author){
        return connection('topics')
        .select("*").where('topics.slug', '=', topic)
        .then(topic => {
          if(topic.length===0){
            return Promise.reject({
              status:404 , msg: 'This category does not exist'
            })
          } else if (topic.length>0){
            const total_count = article.length
            return {articles, total_count}
          }
        })
      }
      
      {
        const total_count = article.length
        return { articles, total_count }
      }
    })
    }
  })
}

exports.selectArticleByID = article_id => {
  const id = +article_id  

  return connection('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count({comment_count : 'comments.comment_id'})
    .groupBy('articles.article_id')
    .select('articles.*')
    .where('articles.article_id','=',id)
    .then(article => {
      if(!article.length){
        
        return Promise.reject({
          status : 404,
          msg : `Article with ID '${article_id}' does not exist!`
        })
      } else {
        return article[0]
      }
    })
  }

exports.updateArticle = (inputID, votesUpdate) => {
  const id = inputID

  if(!votesUpdate) votesUpdate = 0

  return connection('articles')
    .increment('votes', votesUpdate)
    .where('articles.article_id', '=', id)
    .then(() => {
    return connection('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count({comment_count : 'comments.comment_id'})
    .groupBy('articles.article_id')
    .first('articles.*')
    .where('articles.article_id','=',id)
    .then(article => {
      if(!article){
      return Promise.reject({
        status : 404,
        msg : `Article with ID '${inputID}' does not exist!`
    })
  } else return article
    })
    })
}