import contentData from "@/data/content.json";
import portfolioData from "@/data/portfolio.json";
import blogsData from "@/data/blogs.json";
import { assetPath } from "./utils";

function mapPathsDeep(value) {
  if (typeof value === "string") {
    if (value.startsWith("./assets/")) {
      return assetPath(value);
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(mapPathsDeep);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, mapPathsDeep(nested)])
    );
  }
  return value;
}

export function getContent() {
  return mapPathsDeep(contentData);
}

export function getPortfolio() {
  return mapPathsDeep(portfolioData);
}

export function getPortfolioItem(id) {
  const items = getPortfolio();
  return items.find((item) => String(item.id) === String(id)) || null;
}

export function getBlogs() {
  return mapPathsDeep(blogsData);
}

export function getBlog(id) {
  const blogs = getBlogs();
  return blogs.find((blog) => String(blog.id) === String(id)) || null;
}

export function getExperience(index) {
  const content = getContent();
  const experience = content?.resume?.experience?.[Number(index)];
  return experience || null;
}
