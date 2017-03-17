from flask import Blueprint,request
import json
import glob
import os
mod_data = Blueprint('data', __name__, url_prefix='/data')
from dbUtils import DBUtils

@mod_data.route('/get-all-doctors')
def get_doctors():
    query = {}
    search_params = request.args.get("search_params")
    similarity_params = json.loads(request.args.get("similarity_params"))
    lim = int(request.args["limit"]) if request.args.get("limit") else 500
    threshold = int(request.args["threshold"])
    search_params = search_params.split("|")
    if len(search_params)>0:
        for param in search_params:
            if param:
                if "<" in param :
                    l=param.split("<")
                    query[l[0]] = {"$lt": int(l[1].strip())}
                elif ">" in param:
                    l=param.split(">")
                    query[l[0].strip()] = {"$gt": int(l[1].strip())}
                else:
                    l = param.split(":")
                    l[1] = l[1].strip()
                    try:
                        l[1]=int(l[1])
                    except:
                        pass
                    query[l[0].strip()] = l[1]
    collection = DBUtils().get_collection_obj('doximity')
    query_results = collection.find(query).limit(lim)
    nodes = []
    edges_temp  = []
    edges = []
    all_people = set()
    similarity_params = {par: similarity_params[par] for par in similarity_params if len(similarity_params[par]) > 0}
    for doc in query_results:
        result = {"id": doc['URL'].split("/pub/")[-1]}
        if result["id"] in all_people:
            continue
        all_people.add(result["id"])
        for key in doc:
            if key == "Hospital" and len(doc.get(key))>0:
                result["Current_hospital"] = doc.get(key)[0]
            elif key == "URL":
                result["id"] = doc[key].split("/pub/")[-1]
                result["URL"] =  doc[key]
                all_people.add(result["id"])
            elif key == "SimilarURI" and len(similarity_params)==0:
                for people in doc[key]:
                    similar_person = people.split("/pub/")[-1]
                    edges_temp.append({"source": result["id"], "target": similar_person, "value": 1})
            elif not key == "_id":
                result[key] = doc[key]
        nodes.append(result)
    if len(similarity_params)>0:
        # print similarity_params
        # print similarity_params
        for i in range(len(nodes)):
            for j in range(i+1,len(nodes)):
                value = 0
                connection_param = ""
                for key in similarity_params:
                    if nodes[i].get(key) == nodes[j].get(key):
                        # and nodes[i].get(key)!=0:
                        connection_param = key+"|"+connection_param
                        value += int(similarity_params[key])
                if value > threshold:
                    edges.append({"source": nodes[i]["id"],
                                  "target": nodes[j]["id"],
                                  "value": value,
                                  "connection_param":connection_param})


    else:
        for doc in edges_temp:
            if doc.get("target") in all_people:
                edges.append(doc)

    return json.dumps({"nodes":nodes,"links":edges})



@mod_data.route('/get-all-doctors2')
def get_doctors2():
    query = {}
    search_params = request.args.get("search_params")
    similarity_params = json.loads(request.args.get("similarity_params"))
    lim = int(request.args["limit"])
    threshold = int(request.args["threshold"]) if "threshold" in request.args else 4
    search_params = search_params.split("|")
    if len(search_params)>0:
        for param in search_params:
            if param:
                if "<" in param :
                    l=param.split("<")
                    query[l[0]] = {"$lt": int(l[1].strip())}
                elif ">" in param:
                    l=param.split(">")
                    query[l[0].strip()] = {"$gt": int(l[1].strip())}
                else:
                    l = param.split(":")
                    l[1] = l[1].strip()
                    try:
                        l[1]=int(l[1])
                    except:
                        pass
                    query[l[0].strip()] = l[1]
    collection = DBUtils().get_collection_obj('doximity')
    query_results = collection.find(query).limit(lim)
    nodes = []
    edges_temp  = []
    edges = []
    all_people=set()
    similarity_params = {par: similarity_params[par] for par in similarity_params if len(similarity_params[par]) > 0}
    for doc in query_results:
        result = {"id":doc['URL'].split("/pub/")[-1]}
        if result["id"] in all_people:
            continue
        all_people.add(result["id"])

        for key in doc:
            if key == "Hospital" and len(doc.get(key))>0:
                result["Current_hospital"] = doc.get(key)[0]
            elif key == "SimilarURI" and len(similarity_params)==0:
                for people in doc[key]:
                    similar_person = people.split("/pub/")[-1]
                    edges_temp.append({"from": result["id"], "to": similar_person, "value": 1})
            elif not key == "_id":
                result[key] = doc[key]
        txt=""
        keys = ['fullname', 'id',
                'NPI', 'Location', 'Awards_count', 'Certificates_count', 'Grants_count', 'Memberships_count', 'Pubs_count', 'Hospital', 'Education','URL']
        for k in keys:
            if k in result:
                txt += k+":"+str(result.get(k))+"| "
        result["title"]= txt

        nodes.append(result)
    if len(similarity_params)>0:
        # print similarity_params
        # print similarity_params
        for i in range(len(nodes)):
            for j in range(i+1,len(nodes)):
                value = 0
                connection_param = ""
                for key in similarity_params:
                    if nodes[i].get(key) == nodes[j].get(key):
                        # and nodes[i].get(key)!=0:
                        connection_param = key+":"+similarity_params[key]+"| "+connection_param
                        value += int(similarity_params[key])
                if value > threshold:
                    edges.append({"from": nodes[i]["id"],
                                  "to": nodes[j]["id"],
                                  "value": value,
                                  "title":connection_param})


    else:
        for doc in edges_temp:
            if doc.get("to") in all_people:
                edges.append(doc)

    return json.dumps({"nodes":nodes,"links":edges})



def cleanupfile():
    all_data = []
    with open('app/data/dox.json') as data_file:
        query_results = json.load(data_file)
    for row in query_results:
        data =row
        keys =row.keys()
        for key in keys:
            if type(row[key]) is list:
                for i in range(len(row[key])):
                    if type(data[key][i]) is list:
                        for j in range(len(row[key][i])):
                            data[key][i][j]=row[key][i][j].strip()
                    else:
                        data[key][i] = row[key][i].strip()
            elif isinstance(row[key], basestring):
                try:
                    data[key] = row[key].strip()
                except:
                    pass
            if key == "Location" and len(row.get(key)) > 1:
                data["State"] = row.get(key)[1]
                data["City"] = row.get(key)[0]
            elif key == "Education":
                for inst in row[key]:
                    if len(inst)>1:
                        data[inst[1]]=inst[0]
                    # "Tel": "Phone:(440) 285-2888Fax:(440)
            elif key == "Tel":
                nums = row[key].split("Fax")
                phone = nums[0].split(":")
                if len(phone) > 1:
                    data["Phone"] = phone[1]
                if len(nums)>1:
                    fax = nums[1].split(":")
                    if fax>1:
                        data["Fax"]=fax[1]
        all_data.append(data)
    print len(all_data)
    with open('app/data/dox1.json', 'w') as outfile:
        json.dump(all_data, outfile)




@mod_data.route('/clean-mongo')
def cleanup():
    import numbers
    import decimal
    collection = DBUtils().get_collection_obj('doximity')
    query_results = collection.find({})
    for row in query_results:
        data = {}
        data =row
        keys =row.keys()
        for key in keys:
            if type(row[key]) is list:
                for i in range(len(row[key])):
                    if type(data[key][i]) is list:
                        for j in range(len(row[key][i])):
                            data[key][i][j]=row[key][i][j].strip()
                    else:
                        data[key][i] = row[key][i].strip()
            elif isinstance(row[key], basestring):
                try:
                    data[key] = row[key].strip()
                except:
                    pass
            if key == "Location" and len(row.get(key)) > 1:
                data["State"] = row.get(key)[1]
                data["City"] = row.get(key)[0]
            elif key == "Education":
                for inst in row[key]:
                    if len(inst)>1:
                        data[inst[1]]=inst[0]
        collection.find_and_modify(query={'_id': row['_id']}, update={"$set": data})


@mod_data.route('/clean-mongo2')
def cleanup2():
    collection = DBUtils().get_collection_obj('doximity')
    query_results = collection.find({})
    keys = ['Memberships',  'Pubs', 'Grants', 'Awards',  'Certificates']
    for row in query_results:
        data =row
        for key in keys:
            data[key+"_count"]=len(data[key])
        collection.find_and_modify(query={'_id': row['_id']}, update={"$set": data})





def getUnique():
    collection = DBUtils().get_collection_obj('npi_doximity')
    URLResultSet = set()
    URLResult = collection.aggregate([
        {"$group": {
            "_id": "$URL",
            "count": {"$sum": 1}
        }},
        {"$match": {
            "count": {"$gt": 1}
        }}
    ])
    for result in URLResult["result"]:
        # print result
        URLResultSet.add(result["_id"])
        # print URLResultSet
    query_results = collection.find()
    results =[]
    i=0
    for row in query_results:
        cur={}
        if row['URL']  in URLResultSet:
            for param in row:
                if not param =="_id":
                    # print "here"
                    cur[param]=row[param]
            # print cur
            results.append(cur)
            i += 1

    print i
    with open('app/data/doxdup_new.json', 'w') as outfile:
        json.dump(results, outfile)

# getUnique()

# def getUnique2():
#     collection = DBUtils().get_collection_obj('doximity')
#     with open('app/data/kol.json', 'r') as infile:
#         kolData=json.load(infile)
#     for row in kolData:
#         print row['json']['URL']
#         print collection.find_one({'URL':row['json']['URL']})
#         break
#         collection.find_and_modify(query={'_id': dict_entities['_id']}, update={"$set": dict_entities,})
#
#
# #
# # def doxKOL():
# #     collection = DBUtils().get_collection_obj('doximity')
# #     for row in collection.find():
# #         print row
# #         collection.find_and_modify(query={'_id': row['_id']}, update={"$set": row['json'],'$unset':{'json':''}})
# #         break
# #
# # doxKOL()
