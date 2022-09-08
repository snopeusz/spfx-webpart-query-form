docker run -it --rm  --name ${PWD##*/} -v $PWD:/usr/app/spfx -p 4321:4321 -p 35729:35729 ak/lean_node_spfx15_2 /bin/bash
