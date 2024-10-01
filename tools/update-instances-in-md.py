def main():
    file_name     = "../3.0.0/paper-board-pulp-warehouse-logistics.md"
    file_name_out = "../3.0.0/paper-board-pulp-warehouse-logistics.NEW.md"

    analyse = []
    """
    analyse = [
        { "begin": 128, "end": 142, "file": "mock/01.get-supplier-orders.response.SE.json"}
    ]
    """

    with open(file_name, "r") as f:
        md_lines = f.read().splitlines()

    error = ""
    i = 0
    block_opened = False
    block_start_pos = -1 # position of the << ```json >> line!
    block_of_json = False
    block_with_ref = False
    block_ref = ""
    while i < len(md_lines):
        # Search of a block opening:
        if md_lines[i].startswith("```") and len(md_lines[i]) > 3:
            print(f"Found \"{md_lines[i]:s}\" text at position {i:d}")
            print(f"Get block_opened: {block_opened}")
            print(f"Get block_start_pos: {block_start_pos:d}")
            print(f"Get block_of_json: {block_of_json}")
            print(f"Get block_with_ref: {block_with_ref}")
            print(f"Get block_ref: {block_ref:s}")

            # Check if a block is not already opened
            if block_opened == True:
                error = f"A \"{md_lines[i]:s}\" text was found at position {i:d} while a block was still opened from position {block_start_pos:d}"
                print(error)
                break
            block_opened = True
            print(f"Set block_opened = {block_opened}")
            block_start_pos = i
            print(f"Set block_start_pos = {i:d}")

            # Is it a JSON block?
            if md_lines[i] == "```json":
                block_of_json = True
                print(f"Set block_of_json = {block_of_json}")

                # Does the previous line contains a reference to an instance file?
                search_opening = "<!-- file: "
                search_closing = " -->"
                if md_lines[i-1].startswith(search_opening):
                    print(f"Found \"{md_lines[i-1]:s}\" text at position {i-1:d}")
                    block_with_ref = True
                    print(f"Set block_with_ref = {block_with_ref}")
                    block_ref = md_lines[i-1].partition(search_opening)[2].partition(search_closing)[0]
                    print(f"Set block_ref = {block_ref}")
                    
                else:
                    block_with_ref = False
                    print(f"Set block_with_ref = {block_with_ref}")
            else:
                block_of_json = False
                print(f"Set block_of_json = {block_of_json}")

        # Search of a blocking closing:
        if md_lines[i] == '```':
            print(f"Found \"{md_lines[i]:s}\" text at position {i:d}")
            print(f"Get block_opened: {block_opened}")
            print(f"Get block_start_pos: {block_start_pos:d}")
            print(f"Get block_of_json: {block_of_json}")
            print(f"Get block_with_ref: {block_with_ref}")
            print(f"Get block_ref: {block_ref:s}")

            # Check if the block is opened:
            if block_opened == False:
                error = f"A << ``` >> was found at position {i:d} while there was no block opened!"
                break
            # Check that the position of the last block starting is greather than zero:
            if block_start_pos <= 0:
                error = f"A << ``` >> was found at position {i:d} while the position of last block starting is not greater than zero!"

            # Delete lines ONLY if it is a JSON block with ref:
            if block_of_json == True and block_with_ref == True :
                item = {
                    "begin": block_start_pos,
                    "end": i,
                    "file": block_ref
                }
                analyse.append(item)

            # Reset variables:
            block_opened = False
            print(f"Reset block_opened = {block_opened}")
            block_start_pos = -1
            print(f"Reset block_start_pos = {block_start_pos:d}")
            block_of_json = False
            print(f"Reset block_of_json = {block_of_json}")
            block_with_ref = False
            print(f"Reset block_with_ref = {block_with_ref}")
            block_ref = ""
            print(f"Reset block_ref = {block_ref:s}")

        i = i + 1

    print(f"[DEBUG] Error: {error:s}")
    print(analyse)

    print(f"Get len(analyse): {len(analyse):d}")

    """

    0:
    1:
    2: ```json
    3: 1st
    4: 2nd
    5: 3rd
    6: ```
    7:

    """

    for item in analyse:
        print(item)
        with open(item["file"], "r") as f_instance:
            instance_lines = f_instance.read().splitlines()

        no_diff = True
        for n in range(0,len(instance_lines)):
            if instance_lines[n] != md_lines[item["begin"]+1+n]:
                no_diff = False
                print(f"[NOK] line {n:d} of {item["file"]} <> {item["begin"]+1+n} of {file_name}")
                print(f"--- {item["file"]}")
                print(instance_lines[n])
                print(f"--- {file_name}")
                print(md_lines[item["begin"]+1+n])
                print("---")

        if no_diff == True:
            print(f"[OK ] No differences :-)")

    """
    with open(file_name_out, "w") as f_out:
        f_out.writelines(line + '\n' for line in lines)
        f_out.close()
    """

if __name__ == "__main__":
    main()
