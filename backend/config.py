import os
import cx_Oracle
import urllib
import pyodbc
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv('.env.development')
# load_dotenv('.env.production')

iem_ip = os.getenv('IEM_IP')
prism_ip = os.getenv('PRISM_IP')

class Config:
    JWT_COOKIE_SECURE = False
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    cnxn = pyodbc.connect(f'DRIVER=SQL Server; SERVER={prism_ip},1433; DATABASE=FCFA4750; UID=4750; PWD=ai@4750')
    cursor = cnxn.cursor()
    cursor.execute("SELECT [Password] FROM [FCFA4750].[dbo].[ERP_Account] WHERE [Account] = 'U4NCAMS8'") 
    row = cursor.fetchone() 
    oracle_password = row[0]

    platform_params = urllib.parse.quote_plus(f"DRIVER=SQL Server;SERVER={iem_ip};DATABASE=iEM_PRiSM_Platform;UID=iEMADMIN;PWD=crtsoft")
    iem_params = urllib.parse.quote_plus(f"DRIVER=SQL Server;SERVER={iem_ip};DATABASE=IEM;UID=iEMADMIN;PWD=crtsoft")
    iem_params_notes = urllib.parse.quote_plus(f"DRIVER=SQL Server;SERVER={iem_ip};DATABASE=IEM_Notes_OA;UID=iEMADMIN;PWD=crtsoft")
    prism_params = urllib.parse.quote_plus(f"DRIVER=SQL Server;SERVER={prism_ip};DATABASE=prismdb;UID=prismAdmin;PWD=prismAdmin")
    cnxn = pyodbc.connect(f'DRIVER=SQL Server; SERVER={prism_ip},1433; DATABASE=FCFA4750; UID=4750; PWD=ai@4750')
    SQLALCHEMY_BINDS = {
        'platform': "mssql+pyodbc:///?odbc_connect=" + platform_params,
        'iem': "mssql+pyodbc:///?odbc_connect=" + iem_params,
        'iem_notes': "mssql+pyodbc:///?odbc_connect=" + iem_params_notes,
        'prism': "mssql+pyodbc:///?odbc_connect=" + prism_params,
        'oracle_tw': f"oracle://U4NCAMS8:{oracle_password}@(DESCRIPTION =\
                    (sdu = 8192) (tdu = 8192)\
                    (LOAD_BALANCE = ON)\
                    (ADDRESS = (PROTOCOL = tcp)(HOST = 10.110.1.52)(PORT = 1522))\
                    (ADDRESS = (PROTOCOL = tcp)(HOST = 10.110.2.52)(PORT = 1522))\
                    (CONNECT_DATA = (SID = mlrs05u)))"
    }
    SCHEDULER_API_ENABLED = True