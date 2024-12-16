# python check-instances-with-markdown-and-pact.py

import json
from colorama import Fore, Back, Style # pip install colorama
from colorama import just_fix_windows_console
just_fix_windows_console()

def main():
	# Load the `.md` file:
	md_file_name  = "../3.0.0/paper-board-pulp-warehouse-logistics.md"
	f_md = open(md_file_name, "r")
	md_lines = f_md.read().splitlines()

	# We will analyse the/cut `.md` into blocks:
	blocks = []
	block = {}
	"""
	blocks = [
		{
			'begin': 143,
			'end': 147,
			'file': '../3.0.0/mock/GW00&BW00.post-tokens.response.json',
			'description': 'Interaction 0 of Scenario A (Authentication)'
		}
	]
	"""

	search_file_begin   = "<!-- file: "
	search_file_end     = " -->"
	search_block_begin = "```json"
	search_block_end   = "```"
	block_open = False
	search_heading4    = "#### "
	description = "N/A"

	print(Fore.GREEN + f"We start by parsing the \"{md_file_name}\" file." + Style.RESET_ALL)

	i = 0
	while i < len(md_lines):

		if md_lines[i].startswith(search_file_begin) and md_lines[i+1] == search_block_begin:
			# print(f"Found a file reference at position {i+1:d} (1-based index), directly followed by a JSON code block:")
			block_open = True
			block["begin"] = i+2
			begin_pos = md_lines[i].find(search_file_begin) + len(search_file_begin)
			end_pos   = md_lines[i].find(search_file_end)
			file_name = md_lines[i][begin_pos:end_pos]
			block["file"] = file_name
			block["description"] = description

		if md_lines[i] == search_block_end and block_open == True:
			# print(f"Found the end of the block at position {i+1:d} (1-based index):")
			block_open = False
			block["end"] = i-1
			blocks.append(block)
			block = {}

		if md_lines[i].startswith(search_heading4):
			begin_pos = md_lines[i].find(search_heading4) + len(search_heading4)
			description = md_lines[i][begin_pos:] # will be added later

		i = i + 1
	# end of while.

	print(f"Here are the blocks found:")
	print(json.dumps(blocks, indent=2))

	# Load the JSON Pact file:
	pact_file_name = "../3.0.0/mock/papiNet.PACT.json"
	f_pact = open(pact_file_name, "r")
	pact_dict = json.load(f_pact)

	# Analyse block per block:
	for block in blocks:
		print(Fore.CYAN + f"ANALYSE: {block}" + Style.RESET_ALL)

		# Load the (JSON) instance file of the block:
		f_file = open(block["file"], "r")
		file_dict = json.load(f_file)

		for interaction in pact_dict['interactions']:
			if interaction['description'] == block['description']:
				# Compare the `interactions[].response.body` with the instance file:
				if interaction['response']['body'] == file_dict:
					print(">> NO DIFF between the instance and the Pact file :-)")
				else:
					print("THERE ARE DIFF between the instance and the Pact file :-(")
					print("===instance:")
					print(json.dumps(file_dict))
					print(Fore.RED + f"===Pact: <-- TO BE CHANGED!!!" + Style.RESET_ALL)
					print(json.dumps(interaction['response']['body']))
					print("===")

		f = open(block["file"], "r")
		file_lines = f.read().splitlines()

		no_diff = True

		for n in range(0, len(file_lines)):
			m = block["begin"] + n
			if file_lines[n] != md_lines[block["begin"]+n]:
				no_diff = False
				p = max(len(str(n)), len(str(m)))
				print("---")
				print("THERE ARE DIFF between the instance and the Markdown file :-(")
				print("1-based index")
				print("---instance@" + str(n+1).zfill(p) + file_lines[n])
				print(Fore.RED + "---markdown@" + str(m+1).zfill(p) + md_lines[m] + " <-- TO BE CHANGED!!!" + Style.RESET_ALL)
		# end of for.

		if no_diff == True:
			print(">> NO DIFF between the instance and the Markdown file :-)")

		print("---END.")
	# end of for.

if __name__ == "__main__":
	main()