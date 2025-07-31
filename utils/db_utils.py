import pymysql
from contextlib import contextmanager

from config import DB_CONFIG


@contextmanager
def get_connection():
    """Yield a MySQL connection that is automatically closed.

    Usage:
        with get_connection() as conn:
            ...
    """
    connection = pymysql.connect(**DB_CONFIG)
    try:
        yield connection
    finally:
        connection.close()
