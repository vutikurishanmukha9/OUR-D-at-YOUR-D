import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
import numpy as np

# Load environment variables from server/.env
load_dotenv(dotenv_path='server/.env')

MONGO_URI = os.getenv('MONGODB_URI')
if not MONGO_URI:
    print("❌ Error: MONGODB_URI not defined in server/.env")
    exit(1)

def seed_medicines():
    print("🚀 Starting Medicine Seed Script...")
    
    try:
        # Connect to MongoDB with SSL bypass
        import ssl
        client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
        db = client['healthcare'] # Explicitly use 'healthcare' database
        collection = db['medicines']
        
        print("✅ Connected to MongoDB")
        
        # Read CSV file
        csv_path = 'updated_indian_medicine_data.csv'
        if not os.path.exists(csv_path):
            print(f"❌ Error: {csv_path} not found")
            return

        print(f"📖 Reading {csv_path}...")
        # Read CSV with pandas, handle potential encoding issues
        df = pd.read_csv(csv_path, low_memory=False)
        
        # Replace NaN with suitable defaults
        df = df.replace({np.nan: None})
        
        print(f"📊 Found {len(df)} records. Processing data...")
        
        # Transform data to match Mongoose schema
        medicines_to_insert = []
        
        # Limit to 5000 for initial test/performance (optional, remove limit for full seed)
        # df = df.head(5000) 
        
        for _, row in df.iterrows():
            try:
                # Clean price logic
                price_val = 0
                try:
                    price_val = float(row.get('price', 0))
                except:
                    price_val = 0

                # Clean side effects
                side_effects = []
                if row.get('side_effects'):
                    side_effects = [s.strip() for s in str(row.get('side_effects')).split(',')]

                medicine = {
                    'name': str(row.get('name', '')).strip(),
                    'price': price_val,
                    'manufacturer': str(row.get('manufacturer_name', '')).strip(),
                    'type': str(row.get('type', '')).strip(),
                    'packSize': str(row.get('pack_size_label', '')).strip(),
                    'composition': f"{str(row.get('short_composition1', '')).strip()} {str(row.get('short_composition2', '')).strip()}".strip(),
                    'description': str(row.get('medicine_desc', '')).strip(),
                    'sideEffects': side_effects,
                    'isDiscontinued': str(row.get('Is_discontinued', 'FALSE')).upper() == 'TRUE',
                    'updatedAt': pd.Timestamp.now(),
                    'createdAt': pd.Timestamp.now()
                }
                
                # Only add if name exists
                if medicine['name']:
                    medicines_to_insert.append(medicine)
            
            except Exception as e:
                print(f"⚠️ Skipping row due to error: {e}")
                continue

        if not medicines_to_insert:
            print("❌ No valid records found to insert")
            return

        print(f"🧹 Clearing existing medicines...")
        collection.delete_many({})
        
        print(f"💾 Inserting {len(medicines_to_insert)} medicines into database...")
        # Insert in batches to avoid memory issues
        batch_size = 1000
        for i in range(0, len(medicines_to_insert), batch_size):
            batch = medicines_to_insert[i:i+batch_size]
            collection.insert_many(batch)
            print(f"   - Inserted batch {i//batch_size + 1}/{(len(medicines_to_insert)-1)//batch_size + 1}")

        print("\n✅ Medicine seeding completed successfully!")
        
        # Create text index for search using raw pymongo if not exists
        print("🔍 Creating text indices...")
        collection.create_index([
            ('name', 'text'), 
            ('description', 'text'), 
            ('composition', 'text')
        ])
        print("✅ Indices created")

    except Exception as e:
        print(f"❌ Critical Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if 'client' in locals():
            client.close()
            print("🔌 Disconnected from MongoDB")

if __name__ == "__main__":
    seed_medicines()
