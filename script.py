import json
import tkinter as tk
from tkinter import messagebox
from e621 import E621

class E621Client(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("e621 API Client")
        self.geometry("400x200")

        # Check if login.json exists, create a template if not
        self.check_login_file()

        # Load login credentials from login.json
        self.load_credentials()

        # Create the e621 API client
        self.api = E621(self.credentials)

        # Create UI elements
        self.label = tk.Label(self, text="Welcome to e621 API Client")
        self.label.pack(pady=10)

        self.search_button = tk.Button(self, text="Search Posts", command=self.search_posts)
        self.search_button.pack(pady=10)

    def check_login_file(self):
        try:
            with open("login.json", "r") as file:
                pass  # File exists, do nothing
        except FileNotFoundError:
            # File does not exist, create a template
            template = {"login": "your_e621_login", "api_key": "your_e621_api_key"}
            with open("login.json", "w") as file:
                json.dump(template, file, indent=2)

    def load_credentials(self):
        with open("login.json", "r") as file:
            self.credentials = json.load(file)

    def search_posts(self):
        # Example: Search for posts with the "canine" tag
        try:
            posts = self.api.posts.search("canine")
            # Do something with the posts, e.g., print their IDs
            for post in posts:
                print(post.id)
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {str(e)}")

if __name__ == "__main__":
    app = E621Client()
    app.mainloop()
