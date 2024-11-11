import unittest
import requests
from datetime import datetime

BASE_URL = "http://127.0.0.1:5000"  # Replace with the correct host and port

class TestActivitiesAPI(unittest.TestCase):

    def test_get_activities_no_student_id(self):
        response = requests.get(f"{BASE_URL}/activities")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())

    def test_get_activities_valid_student_id(self):
        response = requests.get(f"{BASE_URL}/activities", params={"student_id": 1})
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)  # Should return a list of activities

    def test_create_activity_missing_fields(self):
        data = {"name": "Beach Cleanup"}  # Missing required fields
        response = requests.post(f"{BASE_URL}/activities", json=data)
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())

    def test_create_activity_success(self):
        data = {
            "name": "Tree Planting",
            "description": "Plant trees in the local park",
            "location": "Park",
            "date": "2023-11-20",
            "img": "https://example.com/img/tree.jpg",
            "hours": 3
        }
        response = requests.post(f"{BASE_URL}/activities", json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("id", response.json()[0])  # Check that the first activity in the list has an ID

    def test_update_activity_missing_id(self):
        data = {
            "name": "Beach Cleanup Updated",
            "description": "Updated description",
            "location": "New Beach",
            "date": "2023-12-01",
            "img": "https://example.com/img/beach.jpg",
            "hours": 4
        }
        response = requests.put(f"{BASE_URL}/activities", json=data)
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())

    def test_update_activity_success(self):
        data = {
            "name": "Updated Tree Planting",
            "description": "Updated Tree planting event",
            "location": "Updated Park",
            "date": "2023-12-01",
            "img": "https://example.com/img/tree.jpg",
            "hours": 4
        }
        response = requests.put(f"{BASE_URL}/activities?id=1", json=data)
        self.assertEqual(response.status_code, 200)

class TestHoursAPI(unittest.TestCase):

    def test_get_total_hours_no_student_id(self):
        response = requests.get(f"{BASE_URL}/student/total_hours")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())

    def test_get_total_hours_valid_student_id(self):
        response = requests.get(f"{BASE_URL}/student/total_hours", params={"student_id": 1})
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("total_hours", result)
        self.assertIn("activities", result)
        self.assertIn("donations", result)

    def test_update_status_invalid_event_type(self):
        data = {
            "student_id": 1,
            "event_id": 1,
            "event_type": "invalid",  # Invalid event type
            "status": True
        }
        response = requests.patch(f"{BASE_URL}/student/update_status", json=data)
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())

    def test_update_status_success(self):
        data = {
            "student_id": 1,
            "event_id": 1,
            "event_type": "activity",
            "status": False
        }
        response = requests.patch(f"{BASE_URL}/student/update_status", json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())
        self.assertEqual(response.json()["message"], "Status updated successfully")


class TestEventAPI(unittest.TestCase):

    def test_get_students_by_activity_event_no_id(self):
        response = requests.get(f"{BASE_URL}/event/activity")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())

    def test_get_students_by_activity_event_success(self):
        response = requests.get(f"{BASE_URL}/event/activity", params={"activity_id": 1})
        self.assertEqual(response.status_code, 200)
        students = response.json()
        self.assertIsInstance(students, list)  # Should return a list of students

    def test_get_students_by_donation_event_no_id(self):
        response = requests.get(f"{BASE_URL}/event/donation")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())

    def test_get_students_by_donation_event_success(self):
        response = requests.get(f"{BASE_URL}/event/donation", params={"donation_id": 1})
        self.assertEqual(response.status_code, 200)
        students = response.json()
        self.assertIsInstance(students, list)  # Should return a list of students


if __name__ == "__main__":
    unittest.main()
