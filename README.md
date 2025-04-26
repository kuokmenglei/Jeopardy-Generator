How It Works
1. Fetching Data from the API
The project fetches categories and questions from an external API.

Category Data
The API endpoint for fetching categories is:

bash
Copy
Edit
GET https://rithm-jeopardy.herokuapp.com/api/categories?count=[**integer**]
Replace **integer** with the number of categories you want to fetch (e.g., 100 categories).

Question Data
To retrieve questions for a specific category, use the following endpoint:

bash
Copy
Edit
GET https://rithm-jeopardy.herokuapp.com/api/category?id=[**integer**]
Replace **integer** with the category ID you want to fetch questions for.

Game Instructions
When you open the game, you will see a list of categories.

Click on a category to see the available questions for that category.

Each question will display the "Question" and the "Answer" once clicked.

You can continue exploring other categories and their questions by clicking on them.

Contributing
If you want to contribute to this project, feel free to fork the repository, create a feature branch, and submit a pull request with your changes. If you encounter any bugs or issues, feel free to open an issue.

License
This project is open-source and available under the MIT License.

Acknowledgments
Axios: For making it easy to fetch data from external APIs.

Rithm School: For providing the API to power the Jeopardy game.

That’s it! You now have a fully functional Jeopardy game using JavaScript and an external API. Happy coding! 🎉