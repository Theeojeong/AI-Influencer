import pymysql
from contextlib import contextmanager
from config import DB_CONFIG


@contextmanager
def get_connection():
    """DB 연결을 관리하는 컨텍스트 매니저"""
    connection = None
    try:
        connection = pymysql.connect(
            host=DB_CONFIG["host"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["db"],
            charset=DB_CONFIG["charset"],
            autocommit=False  # 명시적으로 commit 필요
        )
        yield connection
    except Exception as e:
        if connection:
            connection.rollback()
        raise e
    finally:
        if connection:
            connection.close()
