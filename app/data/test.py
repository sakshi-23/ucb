# from flask import Blueprint,request
# import json
# import glob
# import os
# from dbUtils import DBUtils
# #
# #
# # def getUnique2():
# #     collection = DBUtils().get_collection_obj('doximity')
# #     with open('app/data/kol.json', 'r') as infile:
# #         kolData=json.load(infile)
# #     for row in kolData:
# #         print row['json']['URL']
# #         print collection.find_one({'URL':row['json']['URL']})
# #         break
# #         collection.find_and_modify(query={'_id': dict_entities['_id']}, update={"$set": dict_entities,})
# #
# #
# #
# # def doxKOL():
# #     collection = DBUtils().get_collection_obj('doximity')
# #     # for row in collection.find():
# #     #     if 'json' in row:
# #     #         # print "heree"
# #     #         # print row['json']
# #     #         collection.find_and_modify(query={'_id': row['_id']}, update={"$set": row['json'],'$unset':{'json':''}})
# #     #     else:
# #     #         print row
# #     with open('latest.json', 'r') as infile:
# #         latest=json.load(infile)
# #     for row in latest:
# #         url = row['JSON']['URL']
# #         npi= row["npi"]
# #         # res= collection.find_one(query={'URL': url})
# #         # print res,npi
# #         # break
# #         collection.find_and_modify(query={'URL': url}, update={"$set": {'NPI':npi}})
# #
# # doxKOL()
#
# def npiKOL():
#     collection = DBUtils().get_collection_obj('doximity')
#     # for row in collection.find():
#     #     if 'json' in row:
#     #         # print "heree"
#     #         # print row['json']
#     #         collection.find_and_modify(query={'_id': row['_id']}, update={"$set": row['json'],'$unset':{'json':''}})
#     #     else:
#     #         print row
#     with open('npiv2.json', 'r') as infile:
#         latest=json.load(infile)
#     for row in latest:
#         url = json.loads(row['json'])['URL']
#         npi= row["npi"]
#         # print npi
#         # res= collection.find_one(query={'URL': url})
#         # print res,npi
#         # break
#         # break
#         collection.find_and_modify(query={'URL': url}, update={"$set": {'npi':npi},'$unset':{'NPI':''}})
#
# def getEduandHospital():
#     collection = DBUtils().get_collection_obj('doximity')
#     hopitalData=[]
#     eduData=[]
#     for row in collection.find():
#         for hos in row['Hospital']:
#             hopitalData.append([hos.encode('utf-8')])
#         for edu in row['Education']:
#             eduData.append([edu[0].encode('utf-8')])
#
#     import csv
#     with open('hospital.csv', 'w') as fp:
#         a = csv.writer(fp, delimiter=',')
#         a.writerows(hopitalData)
#
#     with open('education.csv', 'w') as fp:
#         a = csv.writer(fp, delimiter=',')
#         a.writerows(eduData)
#
#
# getEduandHospital()
