import React from 'react'
import { render } from 'react-dom'

import ace from 'brace'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/github'

import 'brace/ext/language_tools'
let langTools = ace.acequire('ace/ext/language_tools');

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import { INSTRUCTIONS } from '../constants'

import MappingPropsCompleter from '../completers/mapping_props'
let mpc = new MappingPropsCompleter();
let mappingBasedCompleter = mpc.aceCompleter();
langTools.addCompleter(mappingBasedCompleter);

class Document extends React.Component {
    componentDidMount() {
        this.refs.doc.editor.setOption('enableBasicAutocompletion', true);
    }

    shouldComponentUpdate(nextProps) {
        let updateFlag = (this.props.id !== nextProps.id || nextProps.force);
        
        /* add a custom mapping based completer */
        if(updateFlag && nextProps.mapping) {
            mpc.setMapping(nextProps.mapping);
        }

        return updateFlag;
    }

    handleChange(newValue) {
        this.props.handleDocumentChange(newValue);
    }

    renderMainTab(props) {
        return (
            <TabPanel key="main">
                <AceEditor
                    {...props}
                    theme="github"
                    name="doc-editor"
                    width="97%"
                    height="79vh"
                    showPrintMargin={false}
                    editorProps={{$blockScrolling: Infinity}}
                    ref="doc"
                />
            </TabPanel>
        );
    }

    renderMappingTab() {
        return (
            <TabPanel key="mapping">
                <AceEditor
                    mode="json"
                    theme="github"
                    name="mapping-editor"
                    width="97%"
                    height="79vh"
                    showPrintMargin={false}
                    readOnly={true}
                    editorProps={{$blockScrolling: Infinity}}
                    value={JSON.stringify(this.props.mapping, null, 4)}
                />
            </TabPanel>
        );
    }

    render() {
        let self = this;
        
        let tabs = [], panels = [];
        let mainTabProps; // first/main tab info
        
        if(self.props.doc) {
            tabs.push(
                <Tab key="main">
                    {self.props.id}
                </Tab>
            );
            mainTabProps = {
                value: JSON.stringify(self.props.doc, null, 2),
                mode: 'json',
                readOnly: false,
                onChange: self.handleChange.bind(self),
            };
        }
        else {
            tabs.push(
                <Tab key="main">
                    INFO
                </Tab>
            );
            mainTabProps = {
                value: INSTRUCTIONS,
                mode: 'text',
                readOnly: true,
            }
        }

        panels.push(self.renderMainTab(mainTabProps));

        if(self.props.mapping) {
            tabs.push(
                <Tab key="mapping">
                    {self.props.type}
                </Tab>
            );
            panels.push(self.renderMappingTab());
        }

        return (
            <section id="doc">
                <Tabs selectedIndex={0}>
                    <TabList>
                        {tabs}
                    </TabList>
                    {panels}
                </Tabs>
            </section>
        );
    }
}

module.exports = Document;

