#!/bin/bash

test_files=$(find . -wholename **/*.unit.* -o -wholename **/*.e2e.* -o -wholename **/*.int.*)
route_files=$(find . -wholename **/router.nc.js)

for file in $test_files; do
    echo $file
    rename="$(realpath $file | cut -d'.' -f1)"
    mv $file "${rename}.spec.js"
done

for file in $route_files; do
    echo $file
    rename="$(realpath $file | sed  s/router.nc.js/routes.nc.js/)"
    mv $file "$rename"
done

