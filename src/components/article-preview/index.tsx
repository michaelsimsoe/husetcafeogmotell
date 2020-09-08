import React from 'react';
import { Link } from 'gatsby';

import * as styles from './styles.module.scss';

import { ArticleTag } from '../article-tag';

interface ArticlePreviewProps {
  title: string;
  tags: string[];
  published: string;
  updated: string;
  timeToRead: Number;
  slug: string;
  excerpt: string;
}

export const ArticlePreview: React.FC<ArticlePreviewProps> = (props) => {
  return (
    <article className={styles.article}>
      <header>
        <Link to={props.slug}>
          <h3>{props.title}</h3>
        </Link>
        <div className={styles.article__tags}>
          {props.tags.map((tag) => {
            return <ArticleTag tag={tag} key={tag} />;
          })}
        </div>
        <div className={styles.article__datetime}>
          <time dateTime={props.published}>
            {props.published} <em>(oppdatert {props.updated})</em>
          </time>
          <div className={styles.article__readtime}>
            ca. {props.timeToRead} minutt{+props.timeToRead > 1 ? 'er' : ''} med
            lesestoff
          </div>
        </div>
      </header>
      <section className={styles.article__intro}>
        <p>
          {props.excerpt}{' '}
          <Link className={styles.article__read_more} to={props.slug}>
            <strong>[...]</strong>
          </Link>
        </p>
      </section>
    </article>
  );
};
