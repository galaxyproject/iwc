#!/usr/bin/env bash

set -euo pipefail
[ -n "${DEBUG:-}" ] && set -x
this="${BASH_SOURCE-$0}"
this_dir=$(cd -P -- "$(dirname -- "${this}")" && pwd -P)

wf_dir="${this_dir}/sars-cov-2-variant-calling"

find "${wf_dir}" -maxdepth 1 -mindepth 1 -type d | while read d; do
    name="$(basename "${d}")"
    echo -en "\n*** ${d} ***\n"
    pushd "${d}"
    zip -r "${name}.crate.zip" *
    mv "${name}.crate.zip" ..
    popd
done
