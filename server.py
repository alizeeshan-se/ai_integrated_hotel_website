#!/usr/bin/env python3
"""
Rorjan Restaurant & Hotel — Backend Server
A study-project backend that simulates a real hotel management system.
Data is stored in JSON files instead of a proper database.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
from datetime import datetime
from pathlib import Path

# ── Data directories ──
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

FILES = {
    "bookings":     DATA_DIR / "bookings.json",
    "orders":       DATA_DIR / "orders.json",
    "complaints":   DATA_DIR / "complaints.json",
    "reviews":      DATA_DIR / "reviews.json",
    "contacts":     DATA_DIR / "contacts.json",
    "interactions": DATA_DIR / "ai_interactions.json",
}

# Initialize empty JSON files if they don't exist
for key, filepath in FILES.items():
    if not filepath.exists():
        with open(filepath, "w") as f:
            json.dump([], f)


def load_data(key):
    try:
        with open(FILES[key], "r") as f:
            return json.load(f)
    except Exception:
        return []


def save_data(key, records):
    with open(FILES[key], "w") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)


def append_record(key, record):
    records = load_data(key)
    records.append(record)
    save_data(key, records)


class HotelHandler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        # Custom logging
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {format % args}")

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def send_file(self, path, content_type):
        try:
            with open(path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"404 Not Found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?")[0]

        # ── Static files ──
        if path.startswith("/static/"):
            filename = path[1:]  # Remove leading /
            ext_map = {
                ".css": "text/css",
                ".js": "application/javascript",
                ".png": "image/png",
                ".jpg": "image/jpeg",
                ".ico": "image/x-icon",
            }
            ext = os.path.splitext(filename)[1]
            content_type = ext_map.get(ext, "text/plain")
            self.send_file(filename, content_type)
            return

        # ── HTML Pages ──
        page_map = {
            "/":        "index.html",
            "/rooms":   "rooms.html",
            "/contact": "contact.html",
        }

        if path in page_map:
            self.send_file(page_map[path], "text/html; charset=utf-8")
            return

        # ── Admin API: View all records ──
        if path == "/admin/bookings":
            self.send_json(load_data("bookings"))
        elif path == "/admin/orders":
            self.send_json(load_data("orders"))
        elif path == "/admin/complaints":
            self.send_json(load_data("complaints"))
        elif path == "/admin/reviews":
            self.send_json(load_data("reviews"))
        elif path == "/admin/contacts":
            self.send_json(load_data("contacts"))
        elif path == "/admin/interactions":
            self.send_json(load_data("interactions"))
        elif path == "/admin/stats":
            stats = {
                "bookings":     len(load_data("bookings")),
                "orders":       len(load_data("orders")),
                "complaints":   len(load_data("complaints")),
                "reviews":      len(load_data("reviews")),
                "contacts":     len(load_data("contacts")),
                "ai_messages":  len(load_data("interactions")),
            }
            self.send_json(stats)
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"404 Not Found")

    def do_POST(self):
        path = self.path

        # Read body
        content_length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(content_length)
        try:
            data = json.loads(raw.decode("utf-8"))
        except Exception:
            data = {}

        # ── Room Booking ──
        if path == "/api/booking":
            record = {
                "ref":       data.get("ref", "RRH-0000"),
                "name":      data.get("name", ""),
                "phone":     data.get("phone", ""),
                "room":      data.get("room", ""),
                "checkin":   data.get("checkin", ""),
                "checkout":  data.get("checkout", ""),
                "guests":    data.get("guests", ""),
                "special":   data.get("special", ""),
                "status":    "confirmed",
                "created_at": data.get("timestamp", datetime.now().isoformat()),
            }
            append_record("bookings", record)
            print(f"  ✅ NEW BOOKING: {record['ref']} — {record['name']} ({record['room']})")
            self.send_json({"success": True, "ref": record["ref"]})

        # ── Food Order ──
        elif path == "/api/order":
            record = {
                "order_id":  data.get("order_id", "ORD-0000"),
                "items":     data.get("items", []),
                "room":      data.get("room", ""),
                "name":      data.get("name", ""),
                "total":     data.get("total", 0),
                "status":    "received",
                "created_at": data.get("timestamp", datetime.now().isoformat()),
            }
            append_record("orders", record)
            print(f"  🍽️  NEW ORDER: {record['order_id']} — Room {record['room']}")
            self.send_json({"success": True, "order_id": record["order_id"]})

        # ── Complaint ──
        elif path == "/api/complaint":
            record = {
                "complaint_id": data.get("complaint_id", "CMP-0000"),
                "name":         data.get("name", ""),
                "room":         data.get("room", ""),
                "issue":        data.get("issue", ""),
                "status":       "under_review",
                "created_at":   data.get("timestamp", datetime.now().isoformat()),
            }
            append_record("complaints", record)
            print(f"  📢 COMPLAINT: {record['complaint_id']} — {record['issue'][:40]}")
            self.send_json({"success": True, "complaint_id": record["complaint_id"]})

        # ── Review ──
        elif path == "/api/review":
            record = {
                "name":       data.get("name", ""),
                "city":       data.get("city", ""),
                "rating":     data.get("rating", 5),
                "text":       data.get("text", ""),
                "created_at": data.get("timestamp", datetime.now().isoformat()),
            }
            append_record("reviews", record)
            print(f"  ⭐ REVIEW: {record['name']} — {record['rating']} stars")
            self.send_json({"success": True})

        # ── Contact Form ──
        elif path == "/api/contact":
            record = {
                "name":       data.get("name", ""),
                "phone":      data.get("phone", ""),
                "email":      data.get("email", ""),
                "subject":    data.get("subject", ""),
                "message":    data.get("message", ""),
                "created_at": data.get("timestamp", datetime.now().isoformat()),
            }
            append_record("contacts", record)
            print(f"  📬 CONTACT: {record['name']} — {record['subject']}")
            self.send_json({"success": True})

        # ── AI Interaction Log ──
        elif path == "/api/save-interaction":
            record = {
                "user":       data.get("user", ""),
                "assistant":  data.get("assistant", ""),
                "page":       data.get("page", ""),
                "created_at": data.get("timestamp", datetime.now().isoformat()),
            }
            append_record("interactions", record)
            self.send_json({"success": True})

        else:
            self.send_json({"error": "Endpoint not found"}, 404)


def run():
    import os
    port = int(os.environ.get("PORT", 8080))
    server = HTTPServer(("0.0.0.0", port), HotelHandler)
    print("=" * 60)
    print("  🏨  RORJAN RESTAURANT & HOTEL — Backend Server")
    print("=" * 60)
    print(f"  🌐  Website:  http://localhost:{port}")
    print(f"  🛏️   Rooms:    http://localhost:{port}/rooms")
    print(f"  📞  Contact:  http://localhost:{port}/contact")
    print(f"  📊  Stats:    http://localhost:{port}/admin/stats")
    print(f"  📋  Bookings: http://localhost:{port}/admin/bookings")
    print("=" * 60)
    print("  Press Ctrl+C to stop the server")
    print("=" * 60)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  👋  Server stopped. Khuda Hafiz!")


if __name__ == "__main__":
    run()
