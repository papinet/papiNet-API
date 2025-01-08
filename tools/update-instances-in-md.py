# update-instances-in-md.py

import json

def main():
	# Input file name:
	input_file_name  = "../3.0.0/paper-board-pulp-warehouse-logistics.md"
	input_file_lines = []
	# Output file
	output_file_name = "../3.0.0/paper-board-pulp-warehouse-logistics.NEW.md"
	output_file_lines = []

	# Store the analyse of the input file name
	blocks = []
	block = {}
	"""
	blocks = [
			{ "begin": 128, "end": 142, "file": "mock/01.get-supplier-orders.response.SE.json"}
	]
	"""

	# Open the input file name:
	f = open(input_file_name, "r")
	input_file_lines = f.read().splitlines()

	# Read the input file line by line:
	json_block_with_ref = False
	text_block_with_ref = False
	i = 0
	while i < len(input_file_lines):
		# Search for opening JSON block with instance ref:
		searchJson = "```json"
		searchFile = "<!-- file: "
		if input_file_lines[i] == searchJson and input_file_lines[i-1].startswith(searchFile):
			print(f"Found a JSON block with an instance file reference!")
			print(f"  Found \"{input_file_lines[i]:s}\" text at position {i:d}.")
			print(f"  Found \"{input_file_lines[i-1]:s}\" text at position {i-1:d}.")

			json_block_with_ref = True
			print(f"  Set json_block_with_ref = {json_block_with_ref}.")

			instance_file_name_begin_search = searchFile
			instance_file_name_end_search   = " -->"
			instance_file_name_begin_pos = input_file_lines[i-1].find(instance_file_name_begin_search) + len(instance_file_name_begin_search)
			instance_file_name_end_pos   = input_file_lines[i-1].find(instance_file_name_end_search)
			instance_file_name = input_file_lines[i-1][instance_file_name_begin_pos:instance_file_name_end_pos]
			print(f"  instance_file_name = \"{instance_file_name}\".")
			# Update the block:
			block["begin"] = i
			block["file"] = instance_file_name

		# Search for opening Text block with instance ref:
		searchText = "```text"
		searchFile = "<!-- request-file: "
		if input_file_lines[i] == searchJson and input_file_lines[i-1].startswith(searchFile):
			print(f"Found a Text block with an instance file reference!")
			print(f"  Found \"{input_file_lines[i]:s}\" text at position {i:d}.")
			print(f"  Found \"{input_file_lines[i-1]:s}\" text at position {i-1:d}.")

			text_block_with_ref = True
			print(f"  Set text_block_with_ref = {text_block_with_ref}.")

			instance_file_name_begin_search = searchFile
			instance_file_name_end_search   = " -->"
			instance_file_name_begin_pos = input_file_lines[i-1].find(instance_file_name_begin_search) + len(instance_file_name_begin_search)
			instance_file_name_end_pos   = input_file_lines[i-1].find(instance_file_name_end_search)
			instance_file_name = input_file_lines[i-1][instance_file_name_begin_pos:instance_file_name_end_pos]
			print(f"  instance_file_name = \"{instance_file_name}\".")


		# Search for closing JSON block with instance ref:
		search = "```"
		if input_file_lines[i] == search and json_block_with_ref == True:
			print(f"  Found \"{input_file_lines[i]:s}\" text at position {i:d}, with json_block_with_ref: {json_block_with_ref}")
			# Update the block:
			block["end"] = i
			# Append the current block to blocks, and reset it afterwards:
			blocks.append(block)
			block = {}
			print(f"  Get len(blocks): {len(blocks):d}")
			print(f"  Get blocks: {blocks}")
			# Closing
			json_block_with_ref = False
			print(f"  Set json_block_with_ref = {json_block_with_ref}.")

		# Search for closing Text block with instance ref:
		if input_file_lines[i] == search and text_block_with_ref == True:
			# Closing
			text_block_with_ref = False
			print(f"  Set text_block_with_ref = {text_block_with_ref}.")

		i = i + 1

	end_position_of_previous_block = 0
	for block in blocks:
		print(f"Get block: {block}")
		f = open(block["file"], "r")
		instance_file_lines = f.read().splitlines()

		no_diff = True
		for n in range(0, len(instance_file_lines)):
			if instance_file_lines[n] != input_file_lines[block["begin"]+1+n]:
					no_diff = False
					print(f"[NOK] line {n:d} of {block["file"]} <> {block["begin"]+1+n} of {input_file_name}")
					print(f"--- {block["file"]}")
					print(instance_file_lines[n])
					print(f"--- {input_file_name}")
					print(input_file_lines[block["begin"]+1+n])
					print("---")

		if no_diff == True:
			print(f"[OK ] No differences :-)")

		for n in range(end_position_of_previous_block, block["begin"]+1):
			output_file_lines.append(input_file_lines[n])
		for line in instance_file_lines:
			output_file_lines.append(line)
		end_position_of_previous_block = block["end"]

	for n in range(end_position_of_previous_block, len(input_file_lines)):
		output_file_lines.append(input_file_lines[n])

	"""
	f = open(output_file_name, "w")
	f.writelines(line + '\n' for line in output_file_lines)
	f.close()
	"""

if __name__ == "__main__":
	main()
