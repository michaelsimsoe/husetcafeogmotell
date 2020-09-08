import React from 'react';
import { Link, graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Image from 'gatsby-image';

import MdxBlock from '../components/mdxBlock';
import Layout from '../components/layout';
import SEO from '../components/seo';

import * as styles from './blog.module.scss';
import { ArticleTag } from '../components/article-tag';

interface Props {
  data: {
    mdx: any;
    site: {
      siteMetadata: {
        title: string;
      };
    };
  };
  pageContext: any;
  location: Location;
}

const BlogPostTemplate: React.FC<Props> = ({ data, pageContext, location }) => {
  const post = data.mdx;
  const siteTitle = data.site.siteMetadata.title;
  const { previous, next } = pageContext;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article className={styles.content}>
        <header className={styles.header}>
          <div className={styles.heading_container}>
            <h1>{post.frontmatter.title}</h1>
          </div>
          <div className={styles.hero_img}>
            {post.frontmatter.heroimage ? (
              <Image
                fluid={post.frontmatter.heroimage.sharp.fluid}
                alt="post hero image"
              />
            ) : (
              ''
            )}
          </div>
          <div className={styles.article__tags}>
            {post.frontmatter.tags.map((tag: any) => {
              return <ArticleTag tag={tag} key={tag} />;
            })}
          </div>

          <div className={styles.article__datetime}>
            <time dateTime={post.frontmatter.date}>
              {post.frontmatter.date}{' '}
              <em>(oppdatert {post.frontmatter.updated})</em>
            </time>
            <div className={styles.article__read_time}>
              ca. {post.timeToRead} minutt{+post.timeToRead > 1 ? 'er' : ''} med
              lesestoff
            </div>
          </div>
        </header>

        <div className="blog-content__container">
          <MdxBlock>
            <MDXRenderer>{post.body}</MDXRenderer>
          </MdxBlock>
        </div>

        <nav>
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </article>
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      body
      id
      excerpt(pruneLength: 160)
      timeToRead
      frontmatter {
        title
        date(formatString: "DD.MM.YYYY")
        updated(formatString: "DD.MM.YYYY")
        description
        tags
        heroimage {
          sharp: childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
