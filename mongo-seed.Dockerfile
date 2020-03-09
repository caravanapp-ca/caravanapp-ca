FROM mongo:4.0.10-xenial
COPY mongo-seed/data .
COPY ./mongo-seed/import.sh import.sh

RUN chmod +x /import.sh
CMD ./import.sh
