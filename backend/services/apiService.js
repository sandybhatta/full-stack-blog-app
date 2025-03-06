import axios from 'axios';
import Blog from '../models/blog.js';
import mongoose from 'mongoose';

// Helper function to generate more content for each blog post
const generateContent = () => {
  return `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vehicula ullamcorper nulla, 
    et malesuada nisi volutpat ut. Vivamus fringilla consectetur orci ac vehicula. 
    Nam consectetur, leo in auctor auctor, erat justo aliquet velit, at vehicula lorem ante sit amet purus.
    Suspendisse potenti. Quisque nec nunc eget leo feugiat volutpat.
  `;
};

// Helper function to generate random tags from a predefined list
const getRandomTags = () => {
  const availableTags = ['Technology', 'Lifestyle', 'Food', 'Travel', 'Health', 'Education', 'Business', 'Entertainment', 'Sports'];
  const numberOfTags = Math.floor(Math.random() * 3) + 3; // Between 3 and 5 tags
  const randomTags = [];
  while (randomTags.length < numberOfTags) {
    const randomTag = availableTags[Math.floor(Math.random() * availableTags.length)];
    if (!randomTags.includes(randomTag)) {
      randomTags.push(randomTag);
    }
  }
  return randomTags;
};


const getRandomCategory = () => {
    const availableCategories = ['Technology', 'Lifestyle', 'Food', 'Travel', 'Health', 'Education', 'Business', 'Entertainment', 'Sports'];
    const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    return randomCategory;
  };

// Function to fetch and store dummy blog posts
export const fetchAndStoreDummyBlogs = async () => {
  try {
    console.log('🟡 Fetching dummy blogs...');

    // Fetch dummy blog posts
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=45');
    const dummyPosts = response.data;

    // Delete old blog data before inserting new ones
    await Blog.deleteMany({});
    console.log('🗑️ Old blogs deleted.');

    // Insert new blogs
    const blogPromises = dummyPosts.map((post) => {
      const blog = new Blog({
        title: post.title,
        content: generateContent(), // Use the generated content
        userId:new mongoose.Types.ObjectId(), // Use a dummy ObjectId for userId 
        authorName: 'Dummy Author', // Fake author
        authorEmail: 'dummy@example.com', // Fake email
        category: getRandomCategory(), // Default category
        tags: getRandomTags(), // Random tags for each blog
        comments: [], // Empty array of comments initially
        likes: [], // No likes initially
        shareCount: Math.floor(Math.random() * 10), // Random share count
      });

      return blog.save()
        .then(() => console.log(`✅ Blog saved: ${post.title}`))
        .catch(error => console.error('❌ Error saving blog:', error.message));
    });

    await Promise.all(blogPromises);
    console.log('✅ Dummy blog posts stored successfully in the database!');
  } catch (error) {
    console.error('❌ Error fetching and storing dummy blogs:', error.message);
  }
};
