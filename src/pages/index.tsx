import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout/index';
import SEO from '../components/seo';
import { Intro } from '../components/intro';
import { ArticlePreview } from '../components/article-preview';
import { ArticleList } from '../components/article-list';

interface Props {
  data: {
    allMdx: any;
    site: {
      siteMetadata: {
        title: string;
      };
    };
  };
  location: Location;
}

const BlogIndex: React.FC<Props> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title || 'yo';
  const posts = data.allMdx.edges;

  return (
    <>
      <Layout location={location} title={siteTitle}>
        <SEO title="Jeg liker deg" />
        <Intro />
        <ArticleList articles={posts} />
      </Layout>
    </>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          timeToRead
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD.MM.YYYY")
            title
            description
            tags
            updated(formatString: "DD.MM.YYYY")
          }
        }
      }
    }
  }
`;
