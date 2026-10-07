from tinydb import TinyDB
from errors import SafeJSONStorage


db = TinyDB("db.json", storage=SafeJSONStorage)

suppliers_table = db.table("suppliers")

