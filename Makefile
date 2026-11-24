bd:
	docker exec -it testprisma-postgres-1 psql -U postgres -d shop_db

dev:
	npm run dev

lint:
	npx eslint . --fix

test:
	npx playwright test