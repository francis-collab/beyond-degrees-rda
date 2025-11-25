# bdr-backend/create_tables.py
from app.database import Base, engine
from app.models import *  # This imports ALL your models (User, Project, ContactMessage, etc.)

print("Creating all tables in bdr.db...")
Base.metadata.create_all(bind=engine)
print("All tables created successfully! Contact_messages table is now ready.")
print("You can now delete this file if you want.")