from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)  # seconds between requests

    @task
    def load_home_page(self):
        self.client.get("/")

    @task
    def login(self):
        self.client.post("/login", json={"username": "test", "password": "test"})

    @task
    def get_dashboard(self):
        self.client.get("/api/dashboard")
