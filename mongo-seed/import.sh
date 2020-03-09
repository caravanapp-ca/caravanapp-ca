ls -1 *.json | sed 's/.json$//' | while read col; do
    mongoimport --uri "mongodb://reader:hunter2@caravan-mongo/buddy_reading?option=value" -c $col --jsonArray < $col.json;
done
